import React from 'react';
import { Play, Settings, Share2, Clock, Check, AlertCircle } from 'lucide-react';
import { getYouTubeThumbnail } from '../utils/youtube';

export default function VideoCard({ video, onPlay, onEdit, onShare }) {
  const hasUrl = Boolean(video.youtubeUrl && video.youtubeUrl.trim());
  const thumbnail = hasUrl ? getYouTubeThumbnail(video.youtubeUrl, 'hq') : null;

  return (
    <article className={`video-card ${video.color || 'blue'}`}>
      <div 
        className="card-media-wrapper"
        onClick={() => onPlay(video)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPlay(video); }}
        title={hasUrl ? `${video.title} 시청하기` : '영상 준비 중 - 등록하기'}
      >
        {hasUrl && thumbnail ? (
          <>
            <img 
              src={thumbnail} 
              alt={video.title} 
              className="card-thumb-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="card-play-hover">
              <div className="card-play-icon">
                <Play size={22} fill="currentColor" />
              </div>
            </div>
          </>
        ) : (
          <div className="card-thumb-placeholder">
            <span className="placeholder-emoji">{video.icon || '🎬'}</span>
            <span className="placeholder-msg">영상 링크 등록 대기 중</span>
          </div>
        )}

        {video.duration && (
          <div className="card-duration-badge">
            <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
            {video.duration}
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-meta-top">
          <span className="card-number">VIDEO {video.number}</span>
          <span className="category-pill">
            {video.icon} {video.categoryLabel || video.category}
          </span>
        </div>

        <h3 className="card-title">{video.title}</h3>
        <p className="card-subtitle">{video.subtitle}</p>
        <p className="card-desc">{video.description}</p>

        {video.tags && video.tags.length > 0 && (
          <div className="card-tags">
            {video.tags.map((tag, idx) => (
              <span key={idx} className="card-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <div className={`status-badge ${hasUrl ? 'ready' : 'planned'}`}>
            <span className="status-dot-pulse" />
            {hasUrl ? '시청 가능' : '영상 준비 중'}
          </div>

          <div className="card-actions">
            <button 
              className="card-watch-btn" 
              onClick={() => onPlay(video)}
              aria-label={`${video.title} 시청`}
            >
              <Play size={13} fill="currentColor" /> {hasUrl ? '시청하기' : '상세보기'}
            </button>

            <button 
              className="card-edit-btn" 
              onClick={() => onEdit(video)}
              title="유튜브 링크 및 정보 수정"
              aria-label="영상 정보 수정"
            >
              <Settings size={14} />
            </button>

            <button 
              className="card-edit-btn" 
              onClick={() => onShare(video)}
              title="공유 링크 복사"
              aria-label="공유하기"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
