import React, { useState } from 'react';
import { HelpCircle, X, Sparkles, Settings, Play, Youtube, Info, CheckCircle2, BookOpen } from 'lucide-react';

export default function GuideFloatingWidget({ onOpenManage, onOpenModelGuide }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="floating-guide-widget">
      {/* Tooltip Badge */}
      {showTooltip && !isOpen && (
        <div 
          className="guide-tooltip"
          onClick={() => {
            setIsOpen(true);
            setShowTooltip(false);
          }}
        >
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <strong style={{ fontSize: 12, color: '#1e293b' }}>영상 등록이 필요하신가요?</strong>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>유튜브 링크 연결 가이드 보기</p>
          </div>
          <button 
            className="tooltip-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            aria-label="안내 닫기"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Popover Window */}
      {isOpen && (
        <div className="guide-popover">
          <div className="guide-popover-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #687fe0 0%, #896be0 100%)',
                color: 'white',
                display: 'grid',
                placeItems: 'center',
                fontSize: 18
              }}>
                🎬
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: 13.5, color: '#1e293b' }}>
                  영상관 이용 &amp; 등록 가이드
                </strong>
                <span style={{ fontSize: 11, color: '#64748b' }}>CREATE 모형 연구학교</span>
              </div>
            </div>
            <button 
              className="chat-popover-close" 
              onClick={() => setIsOpen(false)}
              aria-label="팝오버 닫기"
            >
              <X size={16} />
            </button>
          </div>

          <div className="guide-popover-body">
            {/* CREATE 6단계 소개 FAQ */}
            <div className="faq-item" style={{ background: '#f0f7ff', borderColor: '#bae6fd' }}>
              <div className="faq-q" style={{ color: '#0369a1' }}>
                <BookOpen size={15} color="#0284c7" /> CREATE 수업 설계 6단계란?
              </div>
              <div className="faq-a" style={{ color: '#334155' }}>
                <strong>C</strong>(진단: Check &amp; Context) ➔ <strong>R</strong>(탐색: Research &amp; Resource) ➔ <strong>E</strong>(실행: Execution &amp; Engage) ➔ <strong>A</strong>(분석: Analysis &amp; Action) ➔ <strong>T</strong>(전이: Transfer &amp; Think) ➔ <strong>E</strong>(성장: Evolve &amp; Evaluate)의 6단계 및 분석(A) 단계 환류 체계입니다.
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onOpenModelGuide?.();
                  }}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 4, 
                    marginTop: 8, 
                    background: '#0284c7', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: 6, 
                    fontSize: 11.5, 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  <Sparkles size={12} /> 6단계 정의 &amp; 환류 체계도 보기
                </button>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-q">
                <Youtube size={15} color="#ef4444" /> 유튜브 링크는 어떻게 등록하나요?
              </div>
              <div className="faq-a">
                각 영상 카드의 <strong>[톱니바퀴 ⚙️]</strong> 버튼을 누르거나 상단 메뉴의 <strong>[영상 링크 관리]</strong>를 클릭한 뒤 유튜브 URL(일반 영상, Shorts, youtu.be 링크 모두 지원)을 입력하시면 즉시 연동됩니다.
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-q">
                <Play size={15} color="#10b981" /> 영상이 아직 없는 항목은 어떻게 되나요?
              </div>
              <div className="faq-a">
                영상이 준비 중인 항목은 아름다운 안내 포스터와 함께 <strong>'영상 준비 중'</strong>으로 표시됩니다. 준비가 완료되면 언제든 링크만 입력하시면 즉시 시청 가능 상태로 전환됩니다.
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-q">
                <CheckCircle2 size={15} color="#6366f1" /> 저장된 영상 링크는 유지되나요?
              </div>
              <div className="faq-a">
                수정 및 등록된 모든 영상 링크는 브라우저(LocalStorage)에 안전하게 자동 저장되며, 관리창에서 <strong>JSON 백업 파일</strong>로 내보내거나 가져올 수 있습니다.
              </div>
            </div>

            <button 
              className="btn-primary"
              style={{ width: '100%', marginTop: 6 }}
              onClick={() => {
                setIsOpen(false);
                onOpenManage();
              }}
            >
              <Settings size={15} /> 지금 영상 링크 관리자 열기
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button 
        className="guide-fab"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        aria-label="도움말 가이드 열기"
        title="영상 등록 및 시청 가이드"
      >
        {isOpen ? <X size={24} /> : <HelpCircle size={26} />}
      </button>
    </div>
  );
}
