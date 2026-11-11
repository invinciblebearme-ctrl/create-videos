import { INITIAL_VIDEOS } from '../data/initialVideos';

export const STORAGE_KEY = 'create_videos_list_v2';
const LEGACY_STORAGE_KEY = 'create_videos_list_v1';
const ADMIN_PIN_STORAGE_KEY = 'create_videos_admin_pin';

/**
 * 현재 접속 주소가 /videos 하위 경로(예: https://create.allforedu.kr/videos)인지,
 * 루트 도메인(예: *.pages.dev)인지에 맞춰 API 엔드포인트 후보를 반환합니다.
 */
function getApiCandidateUrls() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (pathname === '/videos' || pathname.startsWith('/videos/')) {
    return ['/videos/api/videos', '/api/videos'];
  }
  return ['/api/videos', '/videos/api/videos'];
}

/**
 * 로컬스토리지에 저장된 영상 목록을 불러옵니다 (캐시 및 오프라인 폴백용)
 */
export function loadLocalVideos() {
  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      saved = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((v) => {
          if (v.id === 'create-promo-01' && v.description && v.description.includes('Connect')) {
            return { ...v, description: INITIAL_VIDEOS[0].description };
          }
          if (v.id === 'create-shorts-05' && v.description && v.description.includes('Connect')) {
            return { ...v, description: INITIAL_VIDEOS[4].description };
          }
          return v;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load videos from localStorage', e);
  }
  return INITIAL_VIDEOS;
}

/**
 * 로컬스토리지에 영상 목록을 캐싱합니다
 */
export function saveLocalVideos(videos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (e) {
    console.error('Failed to save videos to localStorage', e);
  }
}

export function getSavedAdminPin() {
  try {
    return sessionStorage.getItem(ADMIN_PIN_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setSavedAdminPin(pin) {
  try {
    if (pin) {
      sessionStorage.setItem(ADMIN_PIN_STORAGE_KEY, pin);
    } else {
      sessionStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
    }
  } catch {}
}

/**
 * Cloudflare Pages Functions (/videos/api/videos 또는 /api/videos)에서 영상 목록을 조회합니다.
 * D1이 비어 있는 초기 상태라면 현재 로컬 데이터(또는 기본 템플릿)로 자동 초기화합니다.
 */
export async function fetchVideosFromCloudflare() {
  const candidates = getApiCandidateUrls();

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        continue;
      }

      const data = await res.json();

      if (data && data.configured) {
        // DB가 연결되어 있으나 아직 데이터가 비어있는 경우 초기 데이터를 DB에 자동 시드(Seed)
        if (data.empty || !Array.isArray(data.videos) || data.videos.length === 0) {
          const seedVideos = loadLocalVideos();
          const seedResult = await saveVideosToCloudflare(seedVideos);
          return {
            ok: true,
            configured: true,
            source: data.source || 'd1',
            seeded: seedResult.ok,
            videos: seedVideos
          };
        }

        saveLocalVideos(data.videos);
        return {
          ok: true,
          configured: true,
          source: data.source || 'd1',
          videos: data.videos
        };
      }
    } catch {
      // 다음 후보 URL 시도
    }
  }

  return {
    ok: false,
    configured: false,
    source: 'local',
    videos: loadLocalVideos()
  };
}

/**
 * Cloudflare D1 / KV에 영상 목록 전체를 저장합니다.
 */
export async function saveVideosToCloudflare(videos, customPin) {
  saveLocalVideos(videos);

  const candidates = getApiCandidateUrls();
  const pin = customPin !== undefined ? customPin : getSavedAdminPin();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (pin) {
    headers['X-Admin-Pin'] = pin;
  }

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ videos })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        continue;
      }

      const data = await res.json();

      if (res.status === 401 && data?.authRequired) {
        const inputPin = window.prompt('관리자 비밀번호(PIN)를 입력해주세요:');
        if (inputPin !== null && inputPin.trim()) {
          setSavedAdminPin(inputPin.trim());
          return saveVideosToCloudflare(videos, inputPin.trim());
        }
        return {
          ok: false,
          configured: true,
          authRequired: true,
          error: '관리자 비밀번호 인증이 취소되었습니다.'
        };
      }

      return {
        ok: Boolean(data?.ok),
        configured: Boolean(data?.configured),
        source: data?.source || 'd1',
        error: data?.error
      };
    } catch {
      // 다음 후보 URL 시도
    }
  }

  return {
    ok: false,
    configured: false,
    source: 'local'
  };
}
