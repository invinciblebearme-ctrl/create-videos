/**
 * CREATE 수업 설계 모형 공식 정의 데이터
 * (C - Check & Context, R - Research & Resource, E - Execution & Engage,
 *  A - Analysis & Action, T - Transfer & Think, E - Evolve & Evaluate)
 */

export const CREATE_MODEL_STEPS = [
  {
    step: 'C',
    name: '진단',
    english: 'Check & Context',
    summary: 'AI·디지털 도구로 학생의 개별 특성(흥미, 강점, 취약점)을 파악해 맞춤형 학습 출발점을 정한다',
    activities: '진단 도구 선정, 학습자 실태 분석',
    flowLabel: '출발점 파악',
    color: '#0284c7',
    badgeBg: '#e0f2fe'
  },
  {
    step: 'R',
    name: '탐색',
    english: 'Research & Resource',
    summary: '진단 결과를 바탕으로 자료와 교육과정을 준비하고 탐구의 방향을 정한다',
    activities: '교육자료 선정, 교육과정 수정 여부 결정, 일반화 문장 및 탐구 질문 준비',
    flowLabel: '자료·질문 준비',
    color: '#0284c7',
    badgeBg: '#e0f2fe'
  },
  {
    step: 'E',
    name: '실행',
    english: 'Execution & Engage',
    summary: '온·오프라인을 연계해 학생 맞춤형 탐구를 실행하고 협력·공유·피드백한다',
    activities: '맞춤형 탐구 실행, 디지털 플랫폼 협력·공유, 데이터 기반 실시간 모니터링·피드백',
    flowLabel: '맞춤형 탐구',
    color: '#0369a1',
    badgeBg: '#e0f2fe'
  },
  {
    step: 'A',
    name: '분석',
    english: 'Analysis & Action',
    summary: '학생의 이해도를 분석·평가하고 다음 단계로 나아갈지, 되돌아갈지 판단한다',
    activities: '실행 분석 및 평가, 환류 및 복귀 여부 판단',
    flowLabel: '목표 도달 판단',
    color: '#1d4ed8',
    badgeBg: '#dbeafe',
    isFeedbackHub: true
  },
  {
    step: 'T',
    name: '전이',
    english: 'Transfer & Think',
    summary: '배운 개념을 타 교과와 실생활 상황에 연결·적용한다',
    activities: '타 교과 및 실생활과 연결',
    flowLabel: '삶에 적용',
    color: '#0284c7',
    badgeBg: '#e0f2fe'
  },
  {
    step: 'E',
    name: '성장',
    english: 'Evolve & Evaluate',
    summary: '단원 학습을 정리하고 스스로 학습을 성찰한다',
    activities: '단원(주제) 학습 정리하기, 자기성찰 질문 및 활동 제공',
    flowLabel: '정리·성찰',
    color: '#0284c7',
    badgeBg: '#e0f2fe'
  }
];

export const CREATE_FLOW_INFO = {
  title: '단계의 흐름: 순차 + 환류',
  keyMessage: '분석(A) 결과에 따라 전이로 나아가거나, 돌아가서 실행과 분석을 반복합니다',
  caption: 'CREATE 6단계 흐름 · A 단계의 환류',
  loops: [
    {
      target: 'E (실행)',
      condition: '이해도가 낮으면 E로 복귀 (다시 실행)'
    },
    {
      target: 'R (탐색)',
      condition: '필요하면 R로 복귀 (재설계 후 다시 실행)'
    },
    {
      target: 'T (전이)',
      condition: '목표 도달 시 T 전이로 나아감'
    }
  ]
};
