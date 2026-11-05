import React from 'react';
import { X, BookOpen, ArrowRight, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { CREATE_MODEL_STEPS, CREATE_FLOW_INFO } from '../data/createModel';

export default function CreateModelModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container create-model-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="create-model-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="modal-header-icon" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
              <BookOpen size={20} color="white" />
            </div>
            <div>
              <h2 id="create-model-title" style={{ margin: 0, fontSize: 18, color: '#0f172a', fontWeight: 800 }}>
                CREATE 모형 6단계 안내
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#64748b' }}>
                연구학교 수업 설계 6단계 정의 및 순차 + 환류 체계도
              </p>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="모달 닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body create-model-body">
          {/* Section 1: 6단계 한눈에 보기 표 */}
          <div className="model-section">
            <div className="model-section-badge">
              <span>6단계 한눈에 보기</span>
            </div>

            <div className="model-table-wrapper">
              <table className="model-table">
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>단계</th>
                    <th style={{ width: '22%' }}>이름</th>
                    <th style={{ width: '42%' }}>한 줄 정의</th>
                    <th style={{ width: '26%' }}>핵심 활동</th>
                  </tr>
                </thead>
                <tbody>
                  {CREATE_MODEL_STEPS.map((item, idx) => (
                    <tr key={idx} className={item.isFeedbackHub ? 'hub-row' : ''}>
                      <td className="step-letter-cell">
                        <span className="step-letter-badge">{item.step}</span>
                      </td>
                      <td className="step-name-cell">
                        <strong>{item.name}</strong>
                        <span className="step-eng-sub">{item.english}</span>
                      </td>
                      <td className="step-desc-cell">
                        {item.summary}
                      </td>
                      <td className="step-act-cell">
                        {item.activities}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: 단계의 흐름: 순차 + 환류 다이어그램 */}
          <div className="model-section" style={{ marginTop: 28 }}>
            <div className="model-section-badge">
              <span>{CREATE_FLOW_INFO.title}</span>
            </div>

            <div className="model-flow-card">
              <div className="flow-card-header">
                <strong>{CREATE_FLOW_INFO.keyMessage}</strong>
              </div>

              {/* Step Sequence Blocks */}
              <div className="flow-blocks-container">
                {CREATE_MODEL_STEPS.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className={`flow-block ${item.isFeedbackHub ? 'hub-block' : ''}`}>
                      <div className="flow-block-step">
                        <strong>{item.step}</strong> {item.name}
                      </div>
                      <div className="flow-block-desc">
                        {item.flowLabel}
                      </div>
                    </div>
                    {idx < CREATE_MODEL_STEPS.length - 1 && (
                      <div className="flow-arrow-indicator" aria-hidden="true">
                        <ArrowRight size={16} color="#94a3b8" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Feedback Loop Explanation */}
              <div className="flow-feedback-loops">
                <div className="loop-item loop-return-e">
                  <RotateCcw size={14} />
                  <span>이해도가 낮으면 <strong>E(실행)</strong>로 복귀 (다시 실행)</span>
                </div>
                <div className="loop-item loop-return-r">
                  <RotateCcw size={14} />
                  <span>필요하면 <strong>R(탐색)</strong>로 복귀 (재설계 후 다시 실행)</span>
                </div>
                <div className="loop-item loop-forward-t">
                  <CheckCircle2 size={14} />
                  <span>목표 도달 시 <strong>T(전이)</strong>로 나아감 (삶에 적용 ➔ 성장)</span>
                </div>
              </div>

              <div className="flow-caption">
                {CREATE_FLOW_INFO.caption}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '8px 24px' }}>
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
