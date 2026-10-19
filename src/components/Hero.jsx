import React from 'react';
import { ArrowDown, Settings, ExternalLink, Play, Film, CheckCircle2, Sparkles } from 'lucide-react';

export default function Hero({ totalCount, readyCount, categoryCount, onOpenManage }) {
  const scrollToLibrary = () => {
    document.getElementById('video-library')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section shell">
      <span className="floating-particle fp-1" aria-hidden="true">🎬</span>
      <span className="floating-particle fp-2" aria-hidden="true">💡</span>
      <span className="floating-particle fp-3" aria-hidden="true">✨</span>
      <span className="floating-particle fp-4" aria-hidden="true">🏫</span>

      <div className="hero-eyebrow">
        <Sparkles size={14} /> CREATE 모형 연구학교 공식 영상관
      </div>

      <h1 className="hero-title">
        생생하게 만나는,<br />
        <span>연구학교의 수업과 실천 이야기</span>
      </h1>

      <p className="hero-desc">
        CREATE 모형(Connect · Recognize · Explore · Apply · Transform · Evaluate)을 적용한 수업 실천 현장,
        연구학교 운영 성과, 학생들의 배움과 성장을 담은 공식 홍보 영상 아카이브입니다.
      </p>

      <div className="hero-actions">
        <button className="btn-primary" onClick={scrollToLibrary}>
          <Film size={17} /> 영상 둘러보기 <ArrowDown size={15} />
        </button>

        <button className="btn-secondary" onClick={() => onOpenManage()}>
          <Settings size={16} /> 영상 링크 등록 / 관리
        </button>

        <a 
          href="https://create.allforedu.kr" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-secondary"
        >
          <span>CREATE 메인 포털</span> <ExternalLink size={15} />
        </a>
      </div>

      <div className="hero-stat-chips">
        <span className="stat-chip">
          <Film size={14} color="#5b73e8" />
          총 <strong>{totalCount}편</strong>의 영상 슬롯
        </span>
        <span className="stat-chip">
          <CheckCircle2 size={14} color="#10b981" />
          현재 <strong>{readyCount}편</strong> 시청 가능
        </span>
        <span className="stat-chip">
          <Sparkles size={14} color="#f59e0b" />
          <strong>{categoryCount}개</strong>의 주제별 카테고리
        </span>
      </div>
    </section>
  );
}
