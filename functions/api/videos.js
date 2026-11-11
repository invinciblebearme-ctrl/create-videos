/**
 * Cloudflare Pages Function: /api/videos
 *
 * Cloudflare D1 데이터베이스(바인딩 이름: DB) 또는 KV(바인딩 이름: VIDEOS_KV)를 통해
 * 영상 주소(youtubeUrl) 및 메타데이터를 영구 저장하고 조회합니다.
 *
 * 테이블이 없을 경우 첫 요청 시 자동으로 생성되므로 별도의 SQL 실행 없이
 * Cloudflare Pages 설정에서 D1 데이터베이스 바인딩(변수명: DB)만 연결하면 즉시 작동합니다.
 */

const CREATE_TABLE_QUERY =
  'CREATE TABLE IF NOT EXISTS videos (id TEXT PRIMARY KEY, sort_order INTEGER NOT NULL DEFAULT 0, title TEXT NOT NULL, youtube_url TEXT DEFAULT "", category TEXT DEFAULT "", is_spotlight INTEGER DEFAULT 0, data_json TEXT NOT NULL, updated_at TEXT NOT NULL)';

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Pin'
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS
  });
}

async function ensureD1Table(db) {
  await db.prepare(CREATE_TABLE_QUERY).run();
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const { env } = context;

  try {
    // 1. Cloudflare D1 (권장: 변수명 DB)
    if (env && env.DB) {
      await ensureD1Table(env.DB);
      const { results } = await env.DB.prepare(
        'SELECT id, sort_order, title, youtube_url, category, is_spotlight, data_json, updated_at FROM videos ORDER BY sort_order ASC'
      ).all();

      if (!results || results.length === 0) {
        return jsonResponse({
          ok: true,
          configured: true,
          source: 'd1',
          empty: true,
          videos: []
        });
      }

      const videos = results.map((row) => {
        let parsed = {};
        try {
          parsed = JSON.parse(row.data_json || '{}');
        } catch {
          parsed = {};
        }
        return {
          ...parsed,
          id: row.id,
          title: row.title ?? parsed.title ?? '',
          youtubeUrl: row.youtube_url ?? parsed.youtubeUrl ?? '',
          category: row.category ?? parsed.category ?? 'overview',
          isSpotlight: Boolean(row.is_spotlight)
        };
      });

      return jsonResponse({
        ok: true,
        configured: true,
        source: 'd1',
        empty: false,
        videos
      });
    }

    // 2. Cloudflare KV 폴백 (변수명 VIDEOS_KV)
    if (env && env.VIDEOS_KV) {
      const raw = await env.VIDEOS_KV.get('create_videos_list_v2');
      const videos = raw ? JSON.parse(raw) : [];
      return jsonResponse({
        ok: true,
        configured: true,
        source: 'kv',
        empty: !raw || videos.length === 0,
        videos
      });
    }

    // 3. 아직 Cloudflare DB 바인딩이 설정되지 않은 상태
    return jsonResponse({
      ok: false,
      configured: false,
      source: 'none',
      message: 'Cloudflare D1 데이터베이스 바인딩(DB)이 아직 연결되지 않았습니다.'
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        configured: true,
        error: error?.message || '데이터베이스 조회 중 오류가 발생했습니다.'
      },
      500
    );
  }
}

async function handleSaveVideos(context) {
  const { request, env } = context;

  try {
    // 선택 사항: 환경변수 ADMIN_PIN이 설정되어 있다면 비밀번호 검증
    if (env && env.ADMIN_PIN) {
      const requestPin = request.headers.get('X-Admin-Pin') || '';
      if (requestPin !== String(env.ADMIN_PIN)) {
        return jsonResponse(
          {
            ok: false,
            authRequired: true,
            error: '관리자 비밀번호(PIN)가 일치하지 않습니다.'
          },
          401
        );
      }
    }

    const body = await request.json();
    const videos = body?.videos;

    if (!Array.isArray(videos)) {
      return jsonResponse(
        {
          ok: false,
          error: '유효하지 않은 영상 목록 데이터입니다 (videos 배열 필요).'
        },
        400
      );
    }

    const now = new Date().toISOString();

    // 1. Cloudflare D1에 트랜잭션(batch)으로 전체 목록 저장
    if (env && env.DB) {
      await ensureD1Table(env.DB);

      const statements = [env.DB.prepare('DELETE FROM videos')];

      videos.forEach((video, idx) => {
        const id = String(video.id || `video-${idx + 1}`);
        const title = String(video.title || '제목 없음');
        const youtubeUrl = String(video.youtubeUrl || '').trim();
        const category = String(video.category || 'overview');
        const isSpotlight = video.isSpotlight ? 1 : 0;
        const normalizedVideo = {
          ...video,
          id,
          title,
          youtubeUrl,
          category,
          isSpotlight: Boolean(video.isSpotlight)
        };

        statements.push(
          env.DB.prepare(
            'INSERT INTO videos (id, sort_order, title, youtube_url, category, is_spotlight, data_json, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
          ).bind(
            id,
            idx,
            title,
            youtubeUrl,
            category,
            isSpotlight,
            JSON.stringify(normalizedVideo),
            now
          )
        );
      });

      await env.DB.batch(statements);

      return jsonResponse({
        ok: true,
        configured: true,
        source: 'd1',
        updatedAt: now,
        count: videos.length
      });
    }

    // 2. Cloudflare KV 폴백
    if (env && env.VIDEOS_KV) {
      await env.VIDEOS_KV.put('create_videos_list_v2', JSON.stringify(videos));
      return jsonResponse({
        ok: true,
        configured: true,
        source: 'kv',
        updatedAt: now,
        count: videos.length
      });
    }

    return jsonResponse(
      {
        ok: false,
        configured: false,
        source: 'none',
        error: 'Cloudflare D1 데이터베이스 바인딩(DB)이 연결되어 있지 않습니다.'
      },
      503
    );
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error?.message || '데이터베이스 저장 중 오류가 발생했습니다.'
      },
      500
    );
  }
}

export async function onRequestPost(context) {
  return handleSaveVideos(context);
}

export async function onRequestPut(context) {
  return handleSaveVideos(context);
}

