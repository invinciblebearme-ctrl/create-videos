import { INITIAL_VIDEOS } from '../data/initialVideos';

export const STORAGE_KEY = 'create_videos_list_v2';
const LEGACY_STORAGE_KEY = 'create_videos_list_v1';
const ADMIN_PIN_STORAGE_KEY = 'create_videos_admin_pin';

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
 * Cloudflare Pages Functions (/api/videos)에서 영상 목록을 조회합니다.
 * D1이 비어 있는 초기 상태라면 현재 로컬 데이터(또는 기본 템플릿)로 자동 초기화합니다.
 */
export async function fetchVideosFromCloudflare() {
  try {
    const res = await fetch('/api/videos', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        ok: false,
        configured: false,
        source: 'local',
        videos: loadLocalVideos()
      };
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

    return {
      ok: false,
      configured: false,
      source: 'local',
      videos: loadLocalVideos()
    };
  } catch (err) {
    return {
      ok: false,
      configured: false,
      source: 'local',
      error: err?.message,
      videos: loadLocalVideos()
    };
  }
}

/**
 * Cloudflare D1 / KV에 영상 목록 전체를 저장합니다.
 */
export async function saveVideosToCloudflare(videos, customPin) {
  saveLocalVideos(videos);

  try {
    const pin = customPin !== undefined ? customPin : getSavedAdminPin();
    const headers = {
      'Content-Type': 'application/json'
    };
    if (pin) {
      headers['X-Admin-Pin'] = pin;
    }

    const res = await fetch('/api/videos', {
      method: 'POST',
      headers,
      body: JSON.stringify({ videos })
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        ok: false,
        configured: false,
        source: 'local'
      };
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
  } catch (err) {
    return {
      ok: false,
      configured: false,
      source: 'local',
      error: err?.message
    };
  }
}

