import React, { useState } from 'react';
import { Video, ExternalLink, Settings, Menu, X, BookOpen, Home } from 'lucide-react';

export default function Header({ onOpenManage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className="site-header shell">
      <button 
        className="brand" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="최상단으로 이동"
      >
        <span className="brand-icon">🎬</span>
        <span className="brand-text">
          <strong>CREATE 홍보영상관</strong>
          <small>AI DIGITAL RESEARCH SCHOOL</small>
        </span>
      </button>

      <nav className={`header-nav ${menuOpen ? 'open' : ''}`} aria-label="메인 메뉴">
        <a 
          href="https://create.allforedu.kr" 
          className="nav-link"
          target="_blank" 
          rel="noopener noreferrer"
          title="CREATE 미래학교 메인 포털 바로가기"
        >
          <Home size={15} /> 메인 포털
        </a>

        <button 
          className="nav-link active"
          onClick={() => scrollToSection('video-library')}
        >
          <Video size={15} /> 영상 아카이브
        </button>

        <a
          href="https://create.allforedu.kr/curriculum/#/read/create-doc-1"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-guide-link"
          title="CREATE 모형 수업설계 길잡이 3D 플립북 전자책 열기"
        >
          <BookOpen size={14} /> 수업설계 길잡이
        </a>

        <button 
          className="nav-admin-btn"
          onClick={() => {
            onOpenManage();
            setMenuOpen(false);
          }}
          title="유튜브 영상 링크 등록 및 메타데이터 수정"
        >
          <Settings size={14} /> 영상 링크 관리
        </button>
      </nav>

      <button 
        className="mobile-menu-btn" 
        aria-label="메뉴 토글" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
}
