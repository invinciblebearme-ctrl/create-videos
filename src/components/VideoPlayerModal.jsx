import React, { useEffect, useState } from 'react';
import { X, Share2, Settings, ExternalLink, Play, Clock, Sparkles, Check, AlertCircle } from 'lucide-react';
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '../utils/youtube';

export default function VideoPlayerModal({ video, onClose, onEdit, onShare, onQuickSaveUrl }) {
  const [quickUrl, setQuickUrl] = useState('');
  const [quickError, setQuickError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const hasUrl = Boolean(video.youtubeUrl && video.youtubeUrl.trim());
  const embedUrl = hasUrl ? getYouTubeEmbedUrl(video.youtubeUrl, true) : null;

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) {
      setQuickError('유튜브 링크를 입력해주세요.');
      return;
    }
    if (!isValidYouTubeUrl(quickUrl)) {
      setQuickError('올바른 유튜브 영상 URL이 아닙니다 (예: https://www.youtube.com/watch?v=...)');
      return;
    }
    onQuickSaveUrl(video.id, quickUrl.trim());
    setQuickUrl('');
    setQuickError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="player-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <span style={{ fontSize: 20 }}>{video.icon || '🎬'}</span>
            <div>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#64748b', display: 'block' }}>
                VIDEO {video.number} · {video.categoryLabel || video.category}
              </span>
              <strong style={{ fontSize: 15, color: '#1e293b' }}>{video.title}</strong>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        {/* Player Media or Coming Soon */}
        {hasUrl && embedUrl ? (
          <div className="player-iframe-wrap">
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="player-placeholder-wrap">
            <span style={{ fontSize: 50, marginBottom: 10 }}>🎬</span>
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#ffffff' }}>
              영상이 아직 등록되지 않았습니다
            </h3>
            <p style={{ fontSize: 13.5, color: '#cbd5e1', maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.6 }}>
              현재 영상 제작 및 편집 과정에 있습니다. 유튜브에 업로드된 영상 주소(또는 Shorts 링크)가 있다면
              아래 입력창에 붙여넣어 지금 바로 연결하실 수 있습니다.
            </p>

            <form onSubmit={handleQuickSubmit} style={{ width: '100%', maxWidth: 520 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... 링크 붙여넣기"
                  value={quickUrl}
                  onChange={(e) => {
                    setQuickUrl(e.target.value);
                    setQuickError('');
                  }}
                  className="form-input"
                  style={{ background: 'white', color: '#1e293b' }}
                />
                <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '10px 18px' }}>
                  즉시 연결
                </button>
              </div>
              {quickError && (
                <div style={{ color: '#f87171', fontSize: 12, marginTop: 8, fontWeight: 700 }}>
                  {quickError}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Video Info Body */}
        <div className="player-info-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="category-pill" style={{ background: '#edf2fe', color: '#435eb8' }}>
                {video.icon} {video.categoryLabel || video.category}
              </span>
              {video.duration && (
                <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} /> {video.duration}
                </span>
              )}
              {video.date && (
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  게시일: {video.date}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="card-watch-btn" 
                onClick={() => onShare(video)}
                title="공유 링크 복사"
              >
                <Share2 size={14} /> 공유하기
              </button>

              <button 
                className="card-watch-btn" 
                onClick={() => {
                  onClose();
                  onEdit(video);
                }}
                title="영상 링크 및 설명 수정"
              >
                <Settings size={14} /> 정보 수정
              </button>
            </div>
          </div>

          <h3>{video.title}</h3>
          <p style={{ fontWeight: 700, color: '#475569', marginBottom: 8 }}>
            {video.subtitle}
          </p>
          <p>{video.description}</p>

          {video.tags && video.tags.length > 0 && (
            <div className="card-tags" style={{ marginTop: 16 }}>
              {video.tags.map((t, idx) => (
                <span key={idx} className="card-tag" style={{ background: '#f1f5f9', color: '#475569' }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
