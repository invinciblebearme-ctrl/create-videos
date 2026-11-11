import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SpotlightVideo from './components/SpotlightVideo';
import VideoGrid from './components/VideoGrid';
import VideoPlayerModal from './components/VideoPlayerModal';
import VideoManageModal from './components/VideoManageModal';
import CreateModelModal from './components/CreateModelModal';
import GuideFloatingWidget from './components/GuideFloatingWidget';
import Footer from './components/Footer';
import { INITIAL_VIDEOS } from './data/initialVideos';
import {
  STORAGE_KEY,
  loadLocalVideos,
  saveLocalVideos,
  fetchVideosFromCloudflare,
  saveVideosToCloudflare
} from './utils/videoStorage';

export default function App() {
  const [videos, setVideos] = useState(() => loadLocalVideos());
  const [dbStatus, setDbStatus] = useState({
    loading: true,
    configured: false,
    source: 'local',
    syncing: false
  });

  const [selectedVideoForPlay, setSelectedVideoForPlay] = useState(null);
  const [selectedVideoForEdit, setSelectedVideoForEdit] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  // Load from Cloudflare D1 / KV on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchVideosFromCloudflare();
      if (!mounted) return;

      if (Array.isArray(result.videos) && result.videos.length > 0) {
        setVideos(result.videos);
      }
      setDbStatus({
        loading: false,
        configured: Boolean(result.configured),
        source: result.source || 'local',
        syncing: false
      });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist to localStorage cache whenever videos change
  useEffect(() => {
    saveLocalVideos(videos);
  }, [videos]);

  // Deep linking: check URL search params for ?video=id
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('video');
    if (videoId) {
      const match = videos.find(v => v.id === videoId);
      if (match) setSelectedVideoForPlay(match);
    }
  }, [videos]);

  const persistVideos = async (nextVideos, actionLabel = '영상 정보가') => {
    setVideos(nextVideos);
    setDbStatus(prev => ({ ...prev, syncing: true }));

    const result = await saveVideosToCloudflare(nextVideos);
    setDbStatus(prev => ({
      ...prev,
      configured: Boolean(result.configured),
      source: result.configured ? (result.source || 'd1') : 'local',
      syncing: false
    }));

    if (result.ok && result.configured) {
      showToast(`☁️ ${actionLabel} Cloudflare DB에 저장되었습니다!`);
    } else if (result.authRequired) {
      showToast(`🔒 ${result.error || '관리자 인증이 필요합니다.'}`);
    } else {
      showToast(`💾 ${actionLabel} 저장되었습니다!`);
    }
  };

  const handlePlay = (video) => {
    setSelectedVideoForPlay(video);
  };

  const handleEdit = (video) => {
    setSelectedVideoForEdit(video);
    setIsManageModalOpen(true);
  };

  const handleOpenManageGeneral = () => {
    setSelectedVideoForEdit(null);
    setIsManageModalOpen(true);
  };

  const handleOpenModelGuide = () => {
    setIsModelModalOpen(true);
  };

  const handleShare = async (video) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?video=${video.id}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast(`'${video.title}' 공유 링크가 복사되었습니다!`);
        return;
      } catch (e) {
        console.warn('Clipboard write failed, fallback to prompt', e);
      }
    }
    window.prompt('영상 공유 링크입니다. 복사해서 사용하세요:', shareUrl);
  };

  const handleSaveVideo = async (updatedVideo) => {
    const exists = videos.some(v => v.id === updatedVideo.id);
    let nextVideos;
    if (exists) {
      nextVideos = videos.map(v => {
        if (v.id === updatedVideo.id) {
          return updatedVideo;
        }
        if (updatedVideo.isSpotlight && v.isSpotlight) {
          return { ...v, isSpotlight: false };
        }
        return v;
      });
    } else {
      nextVideos = [...videos, updatedVideo];
    }

    if (selectedVideoForPlay && selectedVideoForPlay.id === updatedVideo.id) {
      setSelectedVideoForPlay(prev => ({ ...prev, ...updatedVideo }));
    }

    await persistVideos(nextVideos, '영상 정보가');
  };

  const handleQuickSaveUrl = async (videoId, url) => {
    const nextVideos = videos.map(v => {
      if (v.id === videoId) {
        return { ...v, youtubeUrl: url };
      }
      return v;
    });
    setSelectedVideoForPlay(prev => prev ? { ...prev, youtubeUrl: url } : null);
    await persistVideos(nextVideos, '유튜브 영상 주소가');
  };

  const handleDeleteVideo = async (id) => {
    const nextVideos = videos.filter(v => v.id !== id);
    if (selectedVideoForPlay?.id === id) setSelectedVideoForPlay(null);
    setIsManageModalOpen(false);
    await persistVideos(nextVideos, '영상 삭제 내역이');
  };

  const handleResetDefault = async () => {
    if (confirm('모든 영상 데이터를 초기 기본 6개 템플릿으로 복원하시겠습니까? (수정하신 내용이 초기화됩니다)')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('create_videos_list_v1');
      setIsManageModalOpen(false);
      await persistVideos(INITIAL_VIDEOS, '초기 기본값이');
    }
  };

  const handleImportVideos = async (importedVideos) => {
    if (!Array.isArray(importedVideos) || importedVideos.length === 0) {
      alert('유효한 영상 목록 JSON 파일이 아닙니다.');
      return;
    }
    await persistVideos(importedVideos, `백업 영상 ${importedVideos.length}개가`);
  };

  const handleExportVideos = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(videos, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `create_school_videos_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('백업 파일(JSON) 다운로드가 시작되었습니다.');
    } catch (e) {
      alert('백업 파일 생성 중 오류가 발생했습니다.');
    }
  };

  // Find Spotlight Video: marked as isSpotlight, or first video
  const spotlightVideo = videos.find(v => v.isSpotlight) || videos[0];

  const readyCount = videos.filter(v => v.youtubeUrl && v.youtubeUrl.trim()).length;
  const uniqueCategories = new Set(videos.map(v => v.category)).size;

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '99px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          fontSize: 13.5,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          animation: 'fadeIn 0.2s ease'
        }}>
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* Decorative Top Line */}
      <div className="top-line" aria-hidden="true" />

      {/* Header */}
      <Header 
        onOpenManage={handleOpenManageGeneral} 
        onOpenModelGuide={handleOpenModelGuide}
      />

      {/* Main Hero */}
      <main>
        <Hero 
          totalCount={videos.length}
          readyCount={readyCount}
          categoryCount={uniqueCategories}
          onOpenManage={handleOpenManageGeneral}
          onOpenModelGuide={handleOpenModelGuide}
        />

        {/* Spotlight Video */}
        {spotlightVideo && (
          <SpotlightVideo 
            video={spotlightVideo}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onShare={handleShare}
          />
        )}

        {/* Video Grid & Category Filters */}
        <VideoGrid 
          videos={videos}
          onPlay={handlePlay}
          onEdit={handleEdit}
          onShare={handleShare}
          onOpenManage={handleOpenManageGeneral}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Guide Widget */}
      <GuideFloatingWidget 
        onOpenManage={handleOpenManageGeneral} 
        onOpenModelGuide={handleOpenModelGuide}
      />

      {/* Video Player Modal */}
      {selectedVideoForPlay && (
        <VideoPlayerModal 
          video={selectedVideoForPlay}
          onClose={() => setSelectedVideoForPlay(null)}
          onEdit={handleEdit}
          onShare={handleShare}
          onQuickSaveUrl={handleQuickSaveUrl}
        />
      )}

      {/* Video Management Modal */}
      <VideoManageModal 
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        videos={videos}
        dbStatus={dbStatus}
        initialSelectedVideo={selectedVideoForEdit}
        onSaveVideo={handleSaveVideo}
        onDeleteVideo={handleDeleteVideo}
        onResetDefault={handleResetDefault}
        onImportVideos={handleImportVideos}
        onExportVideos={handleExportVideos}
      />

      {/* CREATE 6단계 모형 안내 모달 */}
      <CreateModelModal 
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
      />
    </div>
  );
}
