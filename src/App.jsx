import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SpotlightVideo from './components/SpotlightVideo';
import VideoGrid from './components/VideoGrid';
import VideoPlayerModal from './components/VideoPlayerModal';
import VideoManageModal from './components/VideoManageModal';
import GuideFloatingWidget from './components/GuideFloatingWidget';
import Footer from './components/Footer';
import { INITIAL_VIDEOS, CATEGORIES } from './data/initialVideos';

const STORAGE_KEY = 'create_videos_list_v1';

export default function App() {
  const [videos, setVideos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load videos from localStorage', e);
    }
    return INITIAL_VIDEOS;
  });

  const [selectedVideoForPlay, setSelectedVideoForPlay] = useState(null);
  const [selectedVideoForEdit, setSelectedVideoForEdit] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persist to localStorage whenever videos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    } catch (e) {
      console.error('Failed to save videos to localStorage', e);
    }
  }, [videos]);

  // Deep linking: check URL search params for ?video=id
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('video');
    if (videoId) {
      const match = videos.find(v => v.id === videoId);
      if (match) setSelectedVideoForPlay(match);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePlay = (video) => {
    setSelectedVideoForPlay(video);
  };

  const handleEdit = (video) => {
    setSelectedVideoForEdit(video);
    setIsManageModalOpen(true);
  };

  const handleOpenManageGeneral = () => {
    setSelectedVideoForEdit(videos[0] || null);
    setIsManageModalOpen(true);
  };

  const handleShare = (video) => {
    const url = new URL(window.location.href);
    url.searchParams.set('video', video.id);
    const shareUrl = url.toString();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast(`'${video.title}' 영상 링크가 클립보드에 복사되었습니다!`);
      }).catch(() => {
        prompt('아래 링크를 복사하세요:', shareUrl);
      });
    } else {
      prompt('아래 링크를 복사하세요:', shareUrl);
    }
  };

  const handleSaveVideo = (updatedVideo) => {
    setVideos(prev => {
      const exists = prev.some(v => v.id === updatedVideo.id);
      let next;
      if (exists) {
        next = prev.map(v => {
          if (v.id === updatedVideo.id) {
            return { ...v, ...updatedVideo };
          }
          // If the updated video is spotlight, remove spotlight from others
          if (updatedVideo.isSpotlight && v.isSpotlight) {
            return { ...v, isSpotlight: false };
          }
          return v;
        });
      } else {
        next = [...prev, updatedVideo];
      }
      return next;
    });

    // If currently playing video was updated, update player modal
    if (selectedVideoForPlay && selectedVideoForPlay.id === updatedVideo.id) {
      setSelectedVideoForPlay(prev => ({ ...prev, ...updatedVideo }));
    }

    showToast('영상 정보가 성공적으로 저장되었습니다!');
  };

  const handleQuickSaveUrl = (videoId, url) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return { ...v, youtubeUrl: url };
      }
      return v;
    }));
    setSelectedVideoForPlay(prev => prev ? { ...prev, youtubeUrl: url } : null);
    showToast('유튜브 영상이 즉시 연결되었습니다!');
  };

  const handleDeleteVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    if (selectedVideoForPlay?.id === id) setSelectedVideoForPlay(null);
    setIsManageModalOpen(false);
    showToast('영상이 삭제되었습니다.');
  };

  const handleResetDefault = () => {
    if (confirm('모든 영상 데이터를 초기 기본 6개 템플릿으로 복원하시겠습니까? (수정하신 내용이 초기화됩니다)')) {
      setVideos(INITIAL_VIDEOS);
      localStorage.removeItem(STORAGE_KEY);
      setIsManageModalOpen(false);
      showToast('초기 기본값으로 복원되었습니다.');
    }
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
      <Header onOpenManage={handleOpenManageGeneral} />

      {/* Main Hero */}
      <main>
        <Hero 
          totalCount={videos.length}
          readyCount={readyCount}
          categoryCount={uniqueCategories}
          onOpenManage={handleOpenManageGeneral}
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
      <GuideFloatingWidget onOpenManage={handleOpenManageGeneral} />

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
        initialSelectedVideo={selectedVideoForEdit}
        onSaveVideo={handleSaveVideo}
        onDeleteVideo={handleDeleteVideo}
        onResetDefault={handleResetDefault}
        onExportVideos={handleExportVideos}
      />
    </div>
  );
}
