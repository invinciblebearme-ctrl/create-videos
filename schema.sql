-- Cloudflare D1 데이터베이스 테이블 스키마 (자동 생성됨)
-- functions/api/videos.js가 첫 실행 시 자동으로 이 테이블을 생성하므로 직접 실행하지 않으셔도 됩니다.

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  youtube_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  is_spotlight INTEGER DEFAULT 0,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

