import React, { useState } from 'react';
import { Video, ExternalLink, Settings, Menu, X, BookOpen, Home, Layers } from 'lucide-react';

export default function Header({ onOpenManage, onOpenModelGuide }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className="site-header shell">
      <a 
        href="https://create.allforedu.kr" 
        className="brand" 
        title="AI DIGITAL RESEARCH SCHOOL 메인 플랫폼으로 이동"
      >
        <span className="brand-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
            <line x1="12" y1="2.5" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="21.5" y2="12" />
            <line x1="5.28" y1="5.28" x2="18.72" y2="18.72" />
            <line x1="5.28" y1="18.72" x2="18.72" y2="5.28" />
          </svg>
        </span>
        <span className="brand-text">
          <strong>AI DIGITAL</strong>
          <small>RESEARCH SCHOOL</small>
        </span>
      </a>

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

        <button 
          className="nav-link"
          onClick={() => {
            onOpenModelGuide?.();
            setMenuOpen(false);
          }}
          title="CREATE 6단계 모형 한눈에 보기 & 환류 체계"
        >
          <Layers size={15} /> CREATE 6단계
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
