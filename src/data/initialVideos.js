/**
 * Initial Video Data for CREATE Research School Video Archive
 */

export const INITIAL_VIDEOS = [
  {
    id: 'create-promo-01',
    number: '01',
    isSpotlight: true,
    title: 'CREATE 모형 연구학교 종합 성과 홍보 영상',
    subtitle: '생각을 잇고 배움을 창조하는 미래 교육의 여정',
    category: 'overview',
    categoryLabel: '연구학교 운영',
    color: 'pink',
    icon: '🎬',
    description: 'CREATE 모형의 6단계(진단 Check & Context · 탐색 Research & Resource · 실행 Execution & Engage · 분석 Analysis & Action · 전이 Transfer & Think · 성장 Evolve & Evaluate) 수업 철학과 1년간의 연구학교 실천 발자취를 집약한 공식 종합 홍보영상입니다. 교실 현장의 생생한 변화와 성과를 한눈에 확인하세요.',
    tags: ['#연구학교', '#CREATE모형', '#미래교육', '#성과보고', '#공식영상'],
    youtubeUrl: '', // Ready for user to link YouTube URL
    duration: '05:20',
    date: '2026-10-18',
    views: '1,240'
  },
  {
    id: 'create-practice-02',
    number: '02',
    isSpotlight: false,
    title: '교실 속 CREATE 모형 실증수업 하이라이트',
    subtitle: '학생 주도적 탐구와 디지털 도구의 융합',
    category: 'practice',
    categoryLabel: '수업 실천',
    color: 'blue',
    icon: '💡',
    description: '실제 교실에서 CREATE 모형을 적용하여 학생들이 주도적으로 질문을 발견하고 디지털 도구를 활용해 창의적인 해결책을 만들어가는 수업 실천 영상입니다.',
    tags: ['#수업실천', '#학생주도배움', '#디지털융합', '#수업나눔'],
    youtubeUrl: '',
    duration: '08:45',
    date: '2026-10-16',
    views: '890'
  },
  {
    id: 'create-student-03',
    number: '03',
    isSpotlight: false,
    title: "학생들이 직접 전하는 '우리의 배움과 성장'",
    subtitle: '스스로 질문하고 협력하여 완성한 프로젝트 이야기',
    category: 'student',
    categoryLabel: '학생 활동',
    color: 'mint',
    icon: '🌱',
    description: 'CREATE 수업을 통해 스스로 질문을 던지고 친구들과 협력하며 성장한 학생들의 진솔한 인터뷰와 팀 프로젝트 결과물 발표 영상입니다.',
    tags: ['#학생성장', '#프로젝트학습', '#생생인터뷰', '#성취스토리'],
    youtubeUrl: '',
    duration: '04:15',
    date: '2026-10-15',
    views: '670'
  },
  {
    id: 'create-teacher-04',
    number: '04',
    isSpotlight: false,
    title: '선생님들이 함께한 수업 나눔 & 전문적학습공동체',
    subtitle: '더 나은 수업을 향한 교사들의 연구와 협업',
    category: 'interview',
    categoryLabel: '교원 인터뷰',
    color: 'lavender',
    icon: '💬',
    description: '연구학교를 이끌어온 선생님들의 수업 설계 고민, 동료 교사들과의 협의회, 수업 나눔의 감동적인 순간들을 담은 다큐멘터리 영상입니다.',
    tags: ['#전문적학습공동체', '#교사성장', '#수업나눔', '#동료장학'],
    youtubeUrl: '',
    duration: '06:30',
    date: '2026-10-14',
    views: '540'
  },
  {
    id: 'create-shorts-05',
    number: '05',
    isSpotlight: false,
    title: '1분으로 보는 CREATE 모형 6단계 핵심 숏폼',
    subtitle: '선생님과 학생을 위한 초간단 모형 가이드',
    category: 'shorts',
    categoryLabel: '쇼츠/하이라이트',
    color: 'peach',
    icon: '📱',
    description: '진단(Check & Context)부터 성장(Evolve & Evaluate)까지, CREATE 수업설계 6단계(진단·탐색·실행·분석·전이·성장)와 분석(A) 단계의 환류 체계를 핵심만 쏙쏙 뽑아 1분 영상으로 알기 쉽게 정리한 숏폼 콘텐츠입니다.',
    tags: ['#Shorts', '#1분요약', '#수업설계꿀팁', '#CREATE6단계'],
    youtubeUrl: '',
    duration: '00:58',
    date: '2026-10-12',
    views: '2,150'
  },
  {
    id: 'create-event-06',
    number: '06',
    isSpotlight: false,
    title: '학부모 및 교육가족과 함께한 열린 수업의 날',
    subtitle: '학교와 가정이 함께 응원하는 미래 인재의 꿈',
    category: 'event',
    categoryLabel: '학교 행사',
    color: 'aqua',
    icon: '🏫',
    description: '학부모 초청 수업 공개의 날과 연구학교 성과 공유회 현장 스케치 영상으로, 교육 공동체가 함께 만드는 미래학교의 따뜻한 풍경을 전달합니다.',
    tags: ['#학부모공개의날', '#열린학교', '#교육공동체', '#현장스케치'],
    youtubeUrl: '',
    duration: '07:10',
    date: '2026-10-10',
    views: '730'
  }
];

export const CATEGORIES = [
  { id: 'all', label: '전체 영상', icon: '🎬' },
  { id: 'overview', label: '연구학교 운영', icon: '🏫' },
  { id: 'practice', label: '수업 실천', icon: '💡' },
  { id: 'student', label: '학생 활동', icon: '🌱' },
  { id: 'interview', label: '교원 인터뷰', icon: '💬' },
  { id: 'shorts', label: '쇼츠/하이라이트', icon: '📱' },
  { id: 'event', label: '학교 행사', icon: '🎉' }
];
