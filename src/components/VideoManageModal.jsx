import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Trash2, Plus, Download, Upload, RotateCcw, ExternalLink, AlertTriangle, Cloud, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import { CATEGORIES } from '../data/initialVideos';

export default function VideoManageModal({ 
  isOpen, 
  onClose, 
  videos, 
  dbStatus,
  initialSelectedVideo, 
  onSaveVideo, 
  onDeleteVideo, 
  onResetDefault,
  onImportVideos,
  onExportVideos 
}) {
  const [selectedId, setSelectedId] = useState(videos[0]?.id || '');
  const [showDbGuide, setShowDbGuide] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'overview',
    categoryLabel: '연구학교 운영',
    color: 'pink',
    icon: '🎬',
    description: '',
    tags: '',
    youtubeUrl: '',
    duration: '',
    isSpotlight: false
  });

  useEffect(() => {
    if (initialSelectedVideo) {
      setSelectedId(initialSelectedVideo.id);
    } else if (videos.length > 0 && !selectedId) {
      setSelectedId(videos[0].id);
    }
  }, [initialSelectedVideo, videos]);

  useEffect(() => {
    const current = videos.find(v => v.id === selectedId);
    if (current) {
      setFormData({
        title: current.title || '',
        subtitle: current.subtitle || '',
        category: current.category || 'overview',
        categoryLabel: current.categoryLabel || '연구학교 운영',
        color: current.color || 'blue',
        icon: current.icon || '🎬',
        description: current.description || '',
        tags: Array.isArray(current.tags) ? current.tags.join(', ') : '',
        youtubeUrl: current.youtubeUrl || '',
        duration: current.duration || '',
        isSpotlight: Boolean(current.isSpotlight)
      });
    }
  }, [selectedId, videos]);

  if (!isOpen) return null;

  const handleCategoryChange = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      category: catId,
      categoryLabel: cat ? cat.label : catId,
      icon: cat ? cat.icon : '🎬'
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('영상 제목을 입력해주세요.');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const current = videos.find(v => v.id === selectedId) || {};
    const updated = {
      ...current,
      ...formData,
      id: selectedId,
      tags: tagsArray
    };

    onSaveVideo(updated);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    onClose();
  };

  const handleAddNew = () => {
    const newId = `create-custom-${Date.now()}`;
    const nextNumber = String(videos.length + 1).padStart(2, '0');
    const newVideo = {
      id: newId,
      number: nextNumber,
      isSpotlight: false,
      title: '새 영상 항목',
      subtitle: '영상 부제목을 입력하세요',
      category: 'practice',
      categoryLabel: '수업 실천',
      color: 'blue',
      icon: '💡',
      description: '영상에 대한 상세 설명을 작성해주세요.',
      tags: ['#연구학교', '#CREATE모형'],
      youtubeUrl: '',
      duration: '00:00',
      date: new Date().toISOString().split('T')[0]
    };
    onSaveVideo(newVideo);
    setSelectedId(newId);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result || '[]'));
        if (onImportVideos) {
          onImportVideos(parsed);
        }
      } catch {
        alert('JSON 파일을 읽는 중 오류가 발생했습니다.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const currentParsedId = extractYouTubeId(formData.youtubeUrl);
  const currentPreviewThumb = currentParsedId ? getYouTubeThumbnail(currentParsedId, 'hq') : null;
  const isCloudConnected = Boolean(dbStatus?.configured);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <span style={{ fontSize: 20 }}>⚙️</span>
            <div>
              <strong style={{ fontSize: 16, color: '#1e293b' }}>영상 링크 및 정보 관리</strong>
              <small style={{ display: 'block', color: '#64748b', fontSize: 12 }}>
                유튜브 영상 URL을 등록하거나 카드 메타데이터를 수정합니다
              </small>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="admin-modal-body">
          {/* Cloudflare DB Status Banner */}
          <div
            style={{
              background: isCloudConnected ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${isCloudConnected ? '#a7f3d0' : '#fde68a'}`,
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 14,
              fontSize: 12.5,
              color: isCloudConnected ? '#065f46' : '#92400e'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
                <Cloud size={15} />
                {isCloudConnected
                  ? `Cloudflare ${dbStatus?.source === 'kv' ? 'KV' : 'D1'} 데이터베이스 연결됨 (전체 접속자 실시간 공유)`
                  : '현재 로컬 브라우저 저장 모드 (Cloudflare D1 바인딩 연결 전)'}
              </span>
              <button
                type="button"
                onClick={() => setShowDbGuide(prev => !prev)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  fontSize: 11.5,
                  fontWeight: 800,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                <HelpCircle size={13} />
                {showDbGuide ? '안내 닫기' : 'Cloudflare DB 연결 방법'}
              </button>
            </div>

            {showDbGuide && (
              <div
                style={{
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: `1px dashed ${isCloudConnected ? '#6ee7b7' : '#fcd34d'}`,
                  fontSize: 12,
                  lineHeight: 1.6
                }}
              >
                <strong>Cloudflare 대시보드 1분 설정 방법 (SQL 실행 불필요 · 자동 생성):</strong>
                <ol style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  <li>Cloudflare 대시보드 → <strong>Storage &amp; Databases &gt; D1 SQL Database</strong>에서 데이터베이스 생성 (예: <code>create-videos-db</code>)</li>
                  <li>Cloudflare <strong>Workers &amp; Pages &gt; 프로젝트 선택 &gt; Settings &gt; Bindings(또는 Functions)</strong> 이동</li>
                  <li><strong>D1 database bindings</strong> 추가 → 변수 이름(Variable name)을 반드시 <code>DB</code>로 입력 후 저장 &amp; 재배포하면 즉시 연동됩니다!</li>
                </ol>
              </div>
            )}
          </div>

          {/* Slot Selector & Add New */}
          <div className="form-group">
            <div className="form-label">
              <span>수정할 영상 선택</span>
              <button 
                type="button" 
                onClick={handleAddNew}
                style={{
                  background: '#f0f4ff',
                  border: '1px solid #cddbf8',
                  color: '#4b62d6',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Plus size={13} /> 새 영상 슬롯 추가
              </button>
            </div>
            <select 
              className="form-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {videos.map(v => (
                <option key={v.id} value={v.id}>
                  VIDEO {v.number}. [{v.categoryLabel || v.category}] {v.title} {v.youtubeUrl ? '(🟢 연결됨)' : '(대기 중)'}
                </option>
              ))}
            </select>
          </div>

          {/* YouTube URL input */}
          <div className="form-group">
            <label className="form-label">
              <span>유튜브 영상 링크 (URL)</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                일반 영상, Shorts, 공유 링크(youtu.be) 모두 지원
              </span>
            </label>
            <input 
              type="text" 
              className="form-input"
              placeholder="예: https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
            />
          </div>

          {/* Live YouTube Preview Card */}
          {formData.youtubeUrl.trim() && (
            <div className="url-preview-card">
              {currentPreviewThumb ? (
                <>
                  <img 
                    src={currentPreviewThumb} 
                    alt="미리보기" 
                    className="url-preview-thumb"
                  />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Check size={13} /> 유튜브 비디오 ID 감지됨 ({currentParsedId})
                    </span>
                    <strong style={{ display: 'block', fontSize: 13, marginTop: 4, color: '#1e293b' }}>
                      연결 준비 완료
                    </strong>
                    <a 
                      href={formData.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: 11.5, color: '#4b62d6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}
                    >
                      새 창에서 원본 확인 <ExternalLink size={12} />
                    </a>
                  </div>
                </>
              ) : (
                <div style={{ color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={16} /> 유효한 유튜브 주소 형식을 감지하지 못했습니다. 주소를 다시 확인해주세요.
                </div>
              )}
            </div>
          )}

          {/* Title & Subtitle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">영상 제목</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">부제목 / 키커</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.subtitle} 
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
          </div>

          {/* Category & Color */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">카테고리</label>
              <select 
                className="form-select"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">테마 색상</label>
              <select 
                className="form-select"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              >
                <option value="pink">🌸 핑크 (Pink)</option>
                <option value="blue">🌊 블루 (Blue)</option>
                <option value="mint">🌿 민트 (Mint)</option>
                <option value="peach">🍊 피치 (Peach)</option>
                <option value="lavender">💜 라벤더 (Lavender)</option>
                <option value="aqua">💎 아쿠아 (Aqua)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">영상 길이</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="05:20"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">상세 설명</label>
            <textarea 
              rows={3} 
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <span>검색 태그</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>쉼표(,)로 구분</span>
            </label>
            <input 
              type="text" 
              className="form-input"
              placeholder="#연구학교, #CREATE모형, #수업실천"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Spotlight Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: 12, borderRadius: 10 }}>
            <input 
              type="checkbox" 
              id="isSpotlightCheck"
              checked={formData.isSpotlight}
              onChange={(e) => setFormData({ ...formData, isSpotlight: e.target.checked })}
              style={{ width: 17, height: 17, cursor: 'pointer' }}
            />
            <label htmlFor="isSpotlightCheck" style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
              ⭐ 상단 대표 하이라이트 영상(Spotlight)으로 지정하기
            </label>
          </div>

          {/* Modal Footer */}
          <div className="admin-footer" style={{ margin: '10px -24px -24px', padding: '16px 24px' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {videos.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => {
                    if (confirm(`'${formData.title}' 영상을 정말 삭제하시겠습니까?`)) {
                      onDeleteVideo(selectedId);
                    }
                  }}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#ef4444',
                    borderRadius: 9,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Trash2 size={14} /> 삭제
                </button>
              )}

              <button 
                type="button"
                onClick={onResetDefault}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  borderRadius: 9,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
                title="기본 6개 영상 템플릿으로 초기화"
              >
                <RotateCcw size={14} /> 기본값 초기화
              </button>

              <button 
                type="button"
                onClick={onExportVideos}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  borderRadius: 9,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
                title="영상 데이터 백업 파일(JSON) 다운로드"
              >
                <Download size={14} /> 백업 내보내기
              </button>

              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  borderRadius: 9,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
                title="백업된 JSON 파일 불러오기"
              >
                <Upload size={14} /> 백업 불러오기
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                style={{ padding: '9px 18px', fontSize: 13 }}
              >
                취소
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                style={{ padding: '9px 22px', fontSize: 13 }}
              >
                <Check size={16} /> 변경사항 저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
