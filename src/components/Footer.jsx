import React from 'react';
import { ExternalLink, Film, BookOpen, Layers, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>🎬 CREATE 모형 연구학교 홍보영상관</strong>
            <p>
              CREATE 모형(Connect · Recognize · Explore · Apply · Transform · Evaluate)을 바탕으로
              생각을 잇고 배움을 창조하는 미래 교육의 실천 여정과 성과를 영상으로 공유합니다.
            </p>
          </div>

          <div className="footer-links">
            <strong>플랫폼 바로가기</strong>
            <a href="https://create.allforedu.kr" target="_blank" rel="noopener noreferrer">
              🏠 CREATE 미래학교 메인 포털
            </a>
            <a href="https://create.allforedu.kr/curriculum/#/read/create-doc-1" target="_blank" rel="noopener noreferrer">
              📖 01. CREATE 수업설계 길잡이 전자책
            </a>
            <a href="https://create.allforedu.kr/designer" target="_blank" rel="noopener noreferrer">
              🛠️ 02. CREATE 수업 설계 도우미 (웹앱)
            </a>
            <a href="https://create.allforedu.kr/resources" target="_blank" rel="noopener noreferrer">
              📁 03. 교수학습 제작자료실 (패들렛)
            </a>
          </div>

          <div className="footer-links">
            <strong>관련 서재 및 도구</strong>
            <a href="https://create.allforedu.kr/curriculum/" target="_blank" rel="noopener noreferrer">
              📚 04. 학년별 단원설계안 서재
            </a>
            <a href="https://create.allforedu.kr/curriculum2" target="_blank" rel="noopener noreferrer">
              📖 05. 교과전담 수업지도안 서재
            </a>
            <a href="https://create.allforedu.kr/chatbot" target="_blank" rel="noopener noreferrer">
              🤖 CREATE AI 수업 챗봇
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CREATE Research School. All rights reserved. Powered by AI Digital Research School Platform.</p>
        </div>
      </div>
    </footer>
  );
}
