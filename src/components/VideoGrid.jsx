import React, { useState } from 'react';
import { Search, X, Sparkles, Filter, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import VideoCard from './VideoCard';
import { CATEGORIES } from '../data/initialVideos';

export default function VideoGrid({ videos, onPlay, onEdit, onShare, onOpenManage }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'ready', 'planned'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = videos.filter((video) => {
    // 1. Category match
    const categoryMatch = selectedCategory === 'all' || video.category === selectedCategory;

    // 2. Status match
    const hasUrl = Boolean(video.youtubeUrl && video.youtubeUrl.trim());
    const statusMatch = 
      statusFilter === 'all' ||
      (statusFilter === 'ready' && hasUrl) ||
      (statusFilter === 'planned' && !hasUrl);

    // 3. Search query match (title, subtitle, description, tags, categoryLabel)
    const q = searchQuery.trim().toLowerCase();
    const searchMatch = !q || [
      video.title,
      video.subtitle,
      video.description,
      video.categoryLabel,
      ...(video.tags || [])
    ].some(field => field && field.toLowerCase().includes(q));

    return categoryMatch && statusMatch && searchMatch;
  });

  const resetFilters = () => {
    setSelectedCategory('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <section className="library-section shell" id="video-library">
      {/* Notice Banner */}
      <div className="notice-banner">
        <div className="notice-content">
          <span className="notice-icon">💡</span>
          <div className="notice-text">
            <strong>연구학교 영상 등록 및 유튜브 연동 안내</strong>
            <p>
              현재 연구학교 홍보 영상 제작이 진행 중입니다. 각 카드의 <strong>[톱니바퀴 ⚙️]</strong> 버튼을 누르면
              일반 영상이나 Shorts 등의 유튜브 링크를 언제든지 손쉽게 등록·변경하실 수 있습니다.
            </p>
          </div>
        </div>
        <button className="notice-action-btn" onClick={() => onOpenManage()}>
          <Settings size={14} /> 전체 영상 관리 열기
        </button>
      </div>

      {/* Section Header */}
      <div className="section-header">
        <div>
          <span className="section-kicker">VIDEO ARCHIVE &amp; PLAYLIST</span>
          <h2 className="section-title">
            연구학교 영상 둘러보기 <Sparkles size={20} color="#ffaa00" />
          </h2>
          <p className="section-subtitle">
            수업 실천 다큐멘터리, 성과 공유 보고, 학생 성장 인터뷰, 1분 숏폼 등 다양한 영상을 만나보세요.
          </p>
        </div>
        <span className="section-count-badge">
          총 <strong>{filteredVideos.length}</strong>개의 영상 표시 중
        </span>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        {/* Category Tabs */}
        <div className="category-tabs" role="tablist" aria-label="영상 카테고리">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              role="tab"
              aria-selected={selectedCategory === cat.id}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-box">
          <Search size={16} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="영상 제목, 태그, 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="영상 검색"
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchQuery('')}
              title="검색어 지우기"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Status Filter & Result Count Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b' }}>상태 필터:</span>
          <button 
            className={`category-tab ${statusFilter === 'all' ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: 12 }}
            onClick={() => setStatusFilter('all')}
          >
            전체
          </button>
          <button 
            className={`category-tab ${statusFilter === 'ready' ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: 12 }}
            onClick={() => setStatusFilter('ready')}
          >
            🟢 시청 가능만
          </button>
          <button 
            className={`category-tab ${statusFilter === 'planned' ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: 12 }}
            onClick={() => setStatusFilter('planned')}
          >
            🟡 준비 중만
          </button>
        </div>

        {(selectedCategory !== 'all' || statusFilter !== 'all' || searchQuery) && (
          <button 
            onClick={resetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#4f68d9',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <RefreshCw size={13} /> 필터 초기화
          </button>
        )}
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className="video-grid">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={onPlay}
              onEdit={onEdit}
              onShare={onShare}
            />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'white',
          border: '1px dashed #cbd5e1',
          borderRadius: 20,
          padding: '60px 20px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          <AlertCircle size={44} color="#94a3b8" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: 18, color: '#1e293b', marginBottom: 6 }}>조건에 맞는 영상이 없습니다</h3>
          <p style={{ fontSize: 13, marginBottom: 18 }}>검색어나 필터 조건을 변경해보시거나 초기화해보세요.</p>
          <button className="btn-secondary" onClick={resetFilters}>
            <RefreshCw size={14} /> 필터 전체 초기화
          </button>
        </div>
      )}
    </section>
  );
}
