import React from 'react';
import { Play, Sparkles, Settings, Share2, Clock, CheckCircle2, Film } from 'lucide-react';
import { getYouTubeThumbnail } from '../utils/youtube';

export default function SpotlightVideo({ video, onPlay, onEdit, onShare }) {
  if (!video) return null;

  const hasUrl = Boolean(video.youtubeUrl && video.youtubeUrl.trim());
  const thumbnail = hasUrl ? getYouTubeThumbnail(video.youtubeUrl, 'hq') : null;

  return (
    <section className="spotlight-section shell">
      <div className="spotlight-card">
        <div 
          className="spotlight-media"
          onClick={() => onPlay(video)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPlay(video); }}
          title={hasUrl ? `${video.title} 재생하기` : '영상 준비 중 - 등록하기'}
        >
          {hasUrl && thumbnail ? (
            <>
              <img 
                src={thumbnail} 
                alt={video.title} 
                className="spotlight-thumbnail-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="spotlight-play-overlay">
                <div className="spotlight-play-btn">
                  <Play size={28} fill="currentColor" />
                </div>
                <span style={{ color: 'white', fontWeight: 800, fontSize: 13, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                  영상 지금 시청하기
                </span>
              </div>
            </>
          ) : (
            <div className="spotlight-coming-soon">
              <span className="coming-soon-badge">FEATURED COMING SOON</span>
              <div style={{ fontSize: 44 }}>🎬</div>
              <strong style={{ fontSize: 18, color: '#f8fafc' }}>
                연구학교 공식 종합 영상 준비 중
              </strong>
              <p style={{ fontSize: 12.5, color: '#94a3b8', maxWidth: 360, margin: '0 auto' }}>
                현재 연구학교 운영 성과를 담은 대표 영상 제작 및 편집이 진행 중입니다.
                유튜브 링크가 준비되면 아래 버튼을 눌러 등록하세요.
              </p>
              <button 
                className="notice-action-btn"
                style={{ marginTop: 6 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(video);
                }}
              >
                <Settings size={14} /> 지금 유튜브 링크 등록하기
              </button>
            </div>
          )}

          {video.duration && (
            <div className="card-duration-badge" style={{ position: 'absolute', bottom: 14, right: 14 }}>
              <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
              {video.duration}
            </div>
          )}
        </div>

        <div className="spotlight-info">
          <div>
            <div className="spotlight-top-badge">
              <Sparkles size={13} /> 대표 하이라이트 영상 (Spotlight)
            </div>

            <h2 className="spotlight-title">{video.title}</h2>
            <p className="spotlight-subtitle">{video.subtitle}</p>
            <p className="spotlight-desc">{video.description}</p>

            <div className="spotlight-tags">
              {video.tags?.map((t, idx) => (
                <span key={idx} className="tag-chip">{t}</span>
              ))}
            </div>
          </div>

          <div className="spotlight-footer">
            <div className="status-badge" style={{ color: hasUrl ? '#10b981' : '#f59e0b' }}>
              <span className="status-dot-pulse" style={{ background: hasUrl ? '#10b981' : '#f59e0b' }} />
              {hasUrl ? '시청 가능 (Ready)' : '영상 등록 대기 중'}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="btn-primary" 
                style={{ padding: '8px 16px', fontSize: 13 }}
                onClick={() => onPlay(video)}
              >
                <Play size={14} fill="currentColor" /> {hasUrl ? '영상 시청' : '상세 보기'}
              </button>

              <button 
                className="card-edit-btn" 
                style={{ width: 36, height: 36 }}
                onClick={() => onEdit(video)}
                title="대표 영상 링크 및 정보 수정"
              >
                <Settings size={16} />
              </button>

              <button 
                className="card-edit-btn" 
                style={{ width: 36, height: 36 }}
                onClick={() => onShare(video)}
                title="공유 링크 복사"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
