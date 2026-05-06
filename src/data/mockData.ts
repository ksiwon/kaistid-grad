import { ArtistData } from '../types/artist';
import { Question } from '../types/question';
import { Comment, StickyColor } from '../types/comment';

export const MOCK_ARTISTS: ArtistData[] = [
  // ── Zone A: AI ────────────────────────────────────────────
  {
    id: 'minseo-kim', order: 1, zone: 'ai',
    name: { ko: '김민서', en: 'Kim Minseo' }, studentId: '20200001',
    category: 'ux-interaction',
    work: {
      titleKo: '감각의 경계: 소리로 만지는 세계', titleEn: 'Sensory Threshold: A World Touched by Sound',
      oneLineKo: '청각 장애인을 위한 AI 기반 햅틱 음악 경험 인터페이스',
      statementKo: `소리는 공기의 진동이다. 그 진동은 누군가에게는 음악이 되고, 누군가에게는 완전히 닫힌 문이 된다. 나는 청각 장애를 가진 사람들이 음악을 '듣는' 것이 아닌 '만지는' 방식으로 경험할 수 있도록 AI 기반 햅틱 인터페이스를 설계했다.\n\n착용형 진동 슈트와 바닥 진동 패드를 통해 저주파부터 고주파까지의 음악적 요소를 신체 각 부위에 맵핑하여 전달한다. 드럼의 킥은 발바닥에서, 베이스라인은 척추를 따라, 멜로디는 손끝에서 느껴진다.\n\n이 프로젝트는 장애를 결핍으로 보는 시각에서 벗어나, 감각의 다양성을 풍요로운 경험의 출발점으로 바라보는 철학을 담고 있다.`,
      statementEn: `Sound is the vibration of air. For some, that vibration becomes music; for others, it's a door firmly closed. This project designs an AI-powered haptic interface that allows people with hearing loss to experience music not by hearing, but by touching.`,
      processNoteKo: `초기 프로토타입은 단순한 진동 모터 8개로 구성되었다. 청각 장애인 커뮤니티와 12회의 공동 설계 세션을 거치면서 신체 맵핑이 근본적으로 바뀌었다. AI 학습 모델로 개인별 맵핑을 자동 최적화하는 기능도 추가했다.`,
      keywords: ['햅틱', '접근성', '음악', 'AI', '착용형'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/kim1/800/600', heroUrl: 'https://picsum.photos/seed/kim1h/1920/1080',
      images: ['https://picsum.photos/seed/kim1a/1200/800','https://picsum.photos/seed/kim1b/1200/800','https://picsum.photos/seed/kim1c/1200/800'],
      processImages: ['https://picsum.photos/seed/kim1p1/1200/800','https://picsum.photos/seed/kim1p2/1200/800'],
    },
    contact: { email: 'minseo.kim@kaist.ac.kr', instagram: '@minseo.design', behance: 'minseokimdesign' },
    qrCode: { code: 'KAISTID2026-01', stampLabel: '감각의 경계' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-20', isPublished: true },
  },
  {
    id: 'yuna-jung', order: 2, zone: 'ai',
    name: { ko: '정유나', en: 'Jung Yuna' }, studentId: '20200005',
    category: 'media-video',
    work: {
      titleKo: '0.033초의 진실', titleEn: 'Truth in 0.033 Seconds',
      oneLineKo: '딥페이크 시대, 시각 인식의 한계를 탐구하는 비디오 설치',
      statementKo: `인간의 눈은 초당 30프레임으로 세계를 인식한다. 딥페이크 기술은 정확히 그 한계를 이용한다. 0.033초(1프레임)는 우리가 '진짜'와 '가짜'를 구별할 수 없는 시간이다.\n\n이 작품은 실제 인물 인터뷰와 AI 생성 영상을 1프레임 단위로 교차 편집한 비디오 설치다. 관람자는 무엇이 진짜인지 알 수 없는 상태에서 영상을 본다. 편집의 패턴을 파악하는 순간, 신뢰의 메커니즘에 대한 질문이 시작된다.\n\n우리는 무엇을 근거로 '진짜'라고 믿는가?`,
      keywords: ['딥페이크', 'AI', '미디어 리터러시', '비디오 아트', '인식론'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/jung5/800/600', heroUrl: 'https://picsum.photos/seed/jung5h/1920/1080',
      images: ['https://picsum.photos/seed/jung5a/1200/800','https://picsum.photos/seed/jung5b/1200/800','https://picsum.photos/seed/jung5c/1200/800'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    contact: { email: 'yuna.jung@kaist.ac.kr', instagram: '@yuna.vision' },
    qrCode: { code: 'KAISTID2026-05', stampLabel: '0.033초의 진실' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-19', isPublished: true },
  },
  {
    id: 'minjun-kang', order: 3, zone: 'ai',
    name: { ko: '강민준', en: 'Kang Minjun' }, studentId: '20200010',
    category: 'ux-interaction',
    work: {
      titleKo: '친애하는 알고리즘에게', titleEn: 'Dear Algorithm',
      oneLineKo: '추천 알고리즘이 형성하는 정보 버블을 시각화하고 탈출하는 인터랙티브 설치',
      statementKo: `유튜브 알고리즘은 내가 무엇을 보는지 기억한다. 그리고 그 기억을 바탕으로 내가 더 오래 있을 것 같은 콘텐츠를 보여준다. 우리는 각자 다른 인터넷에 살고 있다.\n\n이 인터랙티브 설치는 관람자의 선택에 따라 변화하는 알고리즘 거품을 실시간으로 시각화한다. 30개의 뉴스 카드 중 5개를 선택하면, 시스템이 관람자의 '알고리즘 프로필'을 생성하고, 이 프로필이 이후 보여주는 정보를 어떻게 바꾸는지 보여준다.`,
      keywords: ['알고리즘', 'AI', '필터 버블', '인터랙티브', '미디어 리터러시'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/kang10/800/600', heroUrl: 'https://picsum.photos/seed/kang10h/1920/1080',
      images: ['https://picsum.photos/seed/kang10a/1200/800','https://picsum.photos/seed/kang10b/1200/800','https://picsum.photos/seed/kang10c/1200/800'],
    },
    contact: { email: 'minjun.kang@kaist.ac.kr', website: 'minjunkang.io' },
    qrCode: { code: 'KAISTID2026-10', stampLabel: '친애하는 알고리즘' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-14', isPublished: true },
  },
  // ── Zone B: Interactive ───────────────────────────────────
  {
    id: 'seungjae-han', order: 4, zone: 'interactive',
    name: { ko: '한승재', en: 'Han Seungjae' }, studentId: '20200006',
    category: 'ux-interaction',
    work: {
      titleKo: '불안을 위한 UI', titleEn: 'UI for Anxiety',
      oneLineKo: '범불안 장애를 가진 사람들을 위한 감정 조절 앱 디자인',
      statementKo: `범불안 장애(GAD)를 가진 사람은 하루에도 수십 번 불안의 파고를 넘는다. 기존의 멘탈 헬스 앱은 대부분 불안이 없는 상태를 '정상'으로 설정하고, 불안을 제거해야 할 것으로 다룬다.\n\n나는 불안을 없애는 것이 아니라 불안과 함께 살아가는 법을 돕는 UX를 설계했다. 'Anchor'는 불안의 강도를 트래킹하고, 그 순간에 맞는 개입(호흡, 그라운딩, 소셜 연결)을 제안한다.`,
      keywords: ['멘탈 헬스', 'UX', '접근성', '감정 디자인', '앱'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/han6/800/600', heroUrl: 'https://picsum.photos/seed/han6h/1920/1080',
      images: ['https://picsum.photos/seed/han6a/1200/800','https://picsum.photos/seed/han6b/1200/800','https://picsum.photos/seed/han6c/1200/800','https://picsum.photos/seed/han6d/1200/800'],
    },
    contact: { email: 'seungjae.han@kaist.ac.kr', behance: 'seungjaehan' },
    qrCode: { code: 'KAISTID2026-06', stampLabel: '불안을 위한 UI' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-21', isPublished: true },
  },
  {
    id: 'yerin-seo', order: 5, zone: 'interactive',
    name: { ko: '서예린', en: 'Seo Yerin' }, studentId: '20200011',
    category: 'concept-research',
    work: {
      titleKo: '돌봄의 디자인학', titleEn: 'Design of Care',
      oneLineKo: '돌봄 노동을 재정의하는 참여형 디자인 연구 및 미래 시나리오',
      statementKo: `'돌봄'은 오랫동안 여성의 일, 비전문적인 일로 여겨졌다. 그러나 팬데믹은 돌봄이 사회 인프라의 핵심임을 드러냈다. 디자인은 이 문제에 어떻게 기여할 수 있을까?\n\n이 연구 프로젝트는 돌봄 노동자(간병인, 보육 교사, 요양보호사)와의 심층 인터뷰를 바탕으로 돌봄 경험의 페인포인트를 분석하고, 2040년의 돌봄 시스템을 위한 세 가지 시나리오를 제안한다. 관람자는 전시장에서 자신의 돌봄 시나리오를 직접 선택하고 투표할 수 있다.`,
      keywords: ['돌봄', '서비스 디자인', '미래 시나리오', '참여형', '사회혁신'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/seo11/800/600', heroUrl: 'https://picsum.photos/seed/seo11h/1920/1080',
      images: ['https://picsum.photos/seed/seo11a/1200/800','https://picsum.photos/seed/seo11b/1200/800','https://picsum.photos/seed/seo11c/1200/800'],
    },
    contact: { email: 'yerin.seo@kaist.ac.kr', website: 'designofcare.kr' },
    qrCode: { code: 'KAISTID2026-11', stampLabel: '돌봄의 디자인학' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-20', isPublished: true },
  },
  {
    id: 'jihoon-moon', order: 6, zone: 'interactive',
    name: { ko: '문지훈', en: 'Moon Jihoon' }, studentId: '20200014',
    category: 'product-industrial',
    work: {
      titleKo: '수리 가능한 기기', titleEn: 'Repairable Device',
      oneLineKo: '수리권 운동에 기반한 모듈형 스마트폰 하드웨어 — 직접 분해해 보세요',
      statementKo: `애플은 아이폰의 배터리를 소비자가 교체하지 못하도록 설계했다. 삼성도 마찬가지다. 우리는 2년마다 멀쩡한 기기를 버리고 새것을 산다.\n\n이 프로젝트는 '수리권(Right to Repair)' 운동의 철학을 제품 설계에 구현한다. 배터리, 카메라, 디스플레이를 일반 드라이버로 교체 가능하게 설계하고, 각 모듈의 수명을 독립적으로 연장할 수 있는 스마트폰 하드웨어 프레임워크를 제안한다. 전시장에서는 직접 분해와 조립을 체험할 수 있다.`,
      keywords: ['수리권', '모듈형', '전자 폐기물', '지속가능', '참여형'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/moon14/800/600', heroUrl: 'https://picsum.photos/seed/moon14h/1920/1080',
      images: ['https://picsum.photos/seed/moon14a/1200/800','https://picsum.photos/seed/moon14b/1200/800','https://picsum.photos/seed/moon14c/1200/800'],
      processImages: ['https://picsum.photos/seed/moon14p1/1200/800','https://picsum.photos/seed/moon14p2/1200/800'],
    },
    contact: { email: 'jihoon.moon@kaist.ac.kr', website: 'repair.design', instagram: '@jihoon.repair' },
    qrCode: { code: 'KAISTID2026-14', stampLabel: '수리 가능한 기기' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-24', isPublished: true },
  },
  // ── Zone C: Design ────────────────────────────────────────
  {
    id: 'soyeon-park', order: 7, zone: 'design',
    name: { ko: '박소연', en: 'Park Soyeon' }, studentId: '20200003',
    category: 'visual-graphic',
    work: {
      titleKo: '한글의 몸, 라틴의 숨', titleEn: 'Body of Hangul, Breath of Latin',
      oneLineKo: '한글과 라틴 문자 체계의 조형적 대화를 실험한 서체 프로젝트',
      statementKo: `한글과 라틴 알파벳은 전혀 다른 원리로 설계된 문자 체계다. 한글은 모아쓰기로 음절을 하나의 덩어리로 구성하고, 라틴 문자는 선형적으로 이어진다. 이 근본적인 차이 안에서 조형적 공통 언어를 찾는 것이 이 프로젝트의 핵심이다.\n\n두 문자 체계의 스트로크, 카운터, 스페이싱 리듬을 분석하여 서로가 서로를 비추는 타이포그래피 시스템을 개발했다.`,
      keywords: ['타이포그래피', '한글', '서체 디자인', '문화 간 디자인'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/park3/800/600', heroUrl: 'https://picsum.photos/seed/park3h/1920/1080',
      images: ['https://picsum.photos/seed/park3a/1200/800','https://picsum.photos/seed/park3b/1200/800','https://picsum.photos/seed/park3c/1200/800'],
    },
    contact: { email: 'soyeon.park@kaist.ac.kr', behance: 'soyeonparktype' },
    qrCode: { code: 'KAISTID2026-03', stampLabel: '한글의 몸' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-15', isPublished: true },
  },
  {
    id: 'jisoo-oh', order: 8, zone: 'design',
    name: { ko: '오지수', en: 'Oh Jisoo' }, studentId: '20200007',
    category: 'visual-graphic',
    work: {
      titleKo: '단층면의 지형학', titleEn: 'Topography of Fault Lines',
      oneLineKo: '지질학적 단층을 모티브로 한 데이터 시각화 포스터 시리즈',
      statementKo: `지진은 보이지 않는 힘이 임계점을 넘을 때 발생한다. 한반도의 지질 단층 데이터를 시각화하면서, 나는 데이터 안에서 자연의 드라마를 발견했다.\n\n포스터 시리즈 'Fault Lines'는 기상청의 지진 관측 데이터를 바탕으로 한반도 하부의 지층 구조를 그래픽으로 재해석한다. 수치 데이터를 아름다운 등고선과 컬러 필드로 변환한다.`,
      keywords: ['데이터 시각화', '지질학', '포스터', '정보 디자인'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/oh7/800/600', heroUrl: 'https://picsum.photos/seed/oh7h/1920/1080',
      images: ['https://picsum.photos/seed/oh7a/1200/800','https://picsum.photos/seed/oh7b/1200/800','https://picsum.photos/seed/oh7c/1200/800'],
    },
    contact: { email: 'jisoo.oh@kaist.ac.kr', instagram: '@jisoo.viz', behance: 'jisoographics' },
    qrCode: { code: 'KAISTID2026-07', stampLabel: '단층면의 지형학' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-17', isPublished: true },
  },
  {
    id: 'sooah-bae', order: 9, zone: 'design',
    name: { ko: '배수아', en: 'Bae Sooah' }, studentId: '20200013',
    category: 'visual-graphic',
    work: {
      titleKo: '빠른 패션, 느린 이야기', titleEn: 'Fast Fashion, Slow Stories',
      oneLineKo: '패스트 패션 산업 종사자들의 노동을 가시화하는 그래픽 캠페인',
      statementKo: `우리가 3만 원에 구매한 티셔츠는 누가, 어떤 조건에서 만들었을까? 방글라데시 의류 공장 노동자의 하루 임금은 약 3달러다. 이 수치는 알지만 얼굴은 모른다.\n\n이 프로젝트는 방글라데시, 캄보디아, 에티오피아의 의류 공장 노동자들의 이야기를 그래픽 언어로 번역한다. 단순히 숫자를 보여주는 인포그래픽이 아니라, 그들의 하루, 꿈, 쉬는 시간의 질감을 전달하는 시각 서사다.`,
      keywords: ['패스트 패션', '노동', '그래픽 캠페인', '사회 디자인', '시각 서사'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/bae13/800/600', heroUrl: 'https://picsum.photos/seed/bae13h/1920/1080',
      images: ['https://picsum.photos/seed/bae13a/1200/800','https://picsum.photos/seed/bae13b/1200/800','https://picsum.photos/seed/bae13c/1200/800','https://picsum.photos/seed/bae13d/1200/800'],
    },
    contact: { email: 'sooah.bae@kaist.ac.kr', instagram: '@sooah.vis', behance: 'sooahbae' },
    qrCode: { code: 'KAISTID2026-13', stampLabel: '빠른 패션, 느린 이야기' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-22', isPublished: true },
  },
  // ── Zone D: Futures ───────────────────────────────────────
  {
    id: 'junho-lee', order: 11, zone: 'futures',
    name: { ko: '이준호', en: 'Lee Junho' }, studentId: '20200002',
    category: 'space-environment',
    work: {
      titleKo: '잊혀진 골목의 기억술', titleEn: 'Mnemonic of Forgotten Alleys',
      oneLineKo: '서울 도심 재개발 지역의 기억을 보존하는 공간 아카이브',
      statementKo: `서울의 재개발은 공간만 지우는 것이 아니라 그 안에 쌓인 삶의 결을 지운다. 나는 사라져가는 골목을 기억하기 위한 공간적 아카이브 시스템을 설계했다.\n\n주민 인터뷰, 생활 소품, 건물 표면의 질감을 3D 스캔으로 기록하고, 이를 물리적 설치물과 디지털 레이어로 동시에 경험할 수 있는 공간으로 재구성했다.`,
      keywords: ['공간 아카이브', '재개발', '기억', '서울', '3D 스캔'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/lee2/800/600', heroUrl: 'https://picsum.photos/seed/lee2h/1920/1080',
      images: ['https://picsum.photos/seed/lee2a/1200/800','https://picsum.photos/seed/lee2b/1200/800','https://picsum.photos/seed/lee2c/1200/800','https://picsum.photos/seed/lee2d/1200/800'],
    },
    contact: { email: 'junho.lee@kaist.ac.kr', instagram: '@junho.space' },
    qrCode: { code: 'KAISTID2026-02', stampLabel: '골목의 기억술' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-18', isPublished: true },
  },
  {
    id: 'gunwoo-choi', order: 12, zone: 'futures',
    name: { ko: '최건우', en: 'Choi Gunwoo' }, studentId: '20200004',
    category: 'product-industrial',
    work: {
      titleKo: '잘 늙는 도구들', titleEn: 'Tools That Age Well',
      oneLineKo: '시간과 함께 아름다워지는 노인을 위한 주방 도구 컬렉션',
      statementKo: `현대 제품 디자인은 젊음을 전제로 설계된다. 손잡이의 지름, 버튼의 크기, 라벨의 폰트 모두 20대의 신체를 기준으로 만들어진다. 고령화 사회에서 이것은 디자인의 실패다.\n\n나는 노인의 신체 변화(악력 감소, 손 떨림, 시력 저하)를 출발점으로 삼아 주방 도구 시리즈를 설계했다. 황동 핸들, 오일 처리된 목재, 무광 도자기 — 이것들은 사용할수록 깊어진다.`,
      keywords: ['유니버설 디자인', '노인', '지속가능성', '주방', '소재'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/choi4/800/600', heroUrl: 'https://picsum.photos/seed/choi4h/1920/1080',
      images: ['https://picsum.photos/seed/choi4a/1200/800','https://picsum.photos/seed/choi4b/1200/800'],
    },
    contact: { email: 'gunwoo.choi@kaist.ac.kr', instagram: '@gunwoo.prod' },
    qrCode: { code: 'KAISTID2026-04', stampLabel: '잘 늙는 도구들' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-22', isPublished: true },
  },
  {
    id: 'taehyun-yoon', order: 13, zone: 'futures',
    name: { ko: '윤태현', en: 'Yoon Taehyun' }, studentId: '20200008',
    category: 'space-environment',
    work: {
      titleKo: '사이 공간 — 엘리베이터 이후', titleEn: 'In-Between Spaces: After the Elevator',
      oneLineKo: '현대 도시 건축에서 사라진 우연적 만남의 공간을 복원하는 설계 제안',
      statementKo: `엘리베이터는 효율을 위해 우연을 제거했다. 계단이 있던 시절, 사람들은 위아래를 오르내리며 이웃을 만났다.\n\n이 프로젝트는 한국 표준형 아파트의 코어 구조를 재설계하여 '사이 공간'을 만드는 건축 제안이다. 엘리베이터 홀과 계단실 사이에 개방적인 중간 레벨을 삽입하여 자연스러운 사회적 접촉이 발생하도록 유도한다.`,
      keywords: ['공동주거', '아파트', '사회적 공간', '건축', '미래'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/yoon8/800/600', heroUrl: 'https://picsum.photos/seed/yoon8h/1920/1080',
      images: ['https://picsum.photos/seed/yoon8a/1200/800','https://picsum.photos/seed/yoon8b/1200/800','https://picsum.photos/seed/yoon8c/1200/800'],
    },
    contact: { email: 'taehyun.yoon@kaist.ac.kr', website: 'taehyunyoon.com' },
    qrCode: { code: 'KAISTID2026-08', stampLabel: '사이 공간' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-16', isPublished: true },
  },
  {
    id: 'chaewon-lim', order: 14, zone: 'futures',
    name: { ko: '임채원', en: 'Lim Chaewon' }, studentId: '20200009',
    category: 'product-industrial',
    work: {
      titleKo: '균사체 가구', titleEn: 'Mycelium Furniture',
      oneLineKo: '버섯 균사체를 소재로 한 생분해 가능한 모듈형 가구 시스템',
      statementKo: `플라스틱 폼은 썩지 않는다. 그런데 우리는 매트리스, 방석, 충전재로 지구를 채우고 있다. 균사체(mycelium)는 농업 폐기물과 결합하여 놀라운 구조 강도를 가진 소재를 만든다. 그리고 사용 후 흙에 돌아간다.\n\n이 프로젝트는 균사체 소재를 이용한 모듈형 소파 시스템을 개발했다. 각 모듈은 3주 안에 생장하며, 원하는 형태로 조합할 수 있다.`,
      keywords: ['균사체', '바이오 소재', '지속가능', '가구', '순환경제'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/lim9/800/600', heroUrl: 'https://picsum.photos/seed/lim9h/1920/1080',
      images: ['https://picsum.photos/seed/lim9a/1200/800','https://picsum.photos/seed/lim9b/1200/800','https://picsum.photos/seed/lim9c/1200/800'],
      processImages: ['https://picsum.photos/seed/lim9p1/1200/800','https://picsum.photos/seed/lim9p2/1200/800','https://picsum.photos/seed/lim9p3/1200/800'],
    },
    contact: { email: 'chaewon.lim@kaist.ac.kr', instagram: '@chaewon.bio' },
    qrCode: { code: 'KAISTID2026-09', stampLabel: '균사체 가구' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-23', isPublished: true },
  },
  {
    id: 'hyunwook-cho', order: 10, zone: 'design',
    name: { ko: '조현욱', en: 'Cho Hyunwook' }, studentId: '20200012',
    category: 'media-video',
    work: {
      titleKo: '잠 못 이루는 밤의 소리', titleEn: 'Sounds of Sleepless Nights',
      oneLineKo: '불면증 환자들의 심야 경험을 담은 3채널 사운드스케이프 영상',
      statementKo: `한국의 불면증 환자는 600만 명이 넘는다. 새벽 2시에 홀로 깨어 있다는 것이 어떤 경험인지, 잠을 자는 사람들은 알지 못한다.\n\n이 작품은 불면증 환자 22명과의 협업으로 제작된 3채널 비디오 설치다. 각각의 채널은 서울, 대전, 부산의 심야 풍경과 그 도시에서 잠 못 이루는 사람들의 소리를 담는다.`,
      keywords: ['사운드스케이프', '불면증', '도시', '비디오 설치', '협업'],
    },
    media: {
      thumbnailUrl: 'https://picsum.photos/seed/cho12/800/600', heroUrl: 'https://picsum.photos/seed/cho12h/1920/1080',
      images: ['https://picsum.photos/seed/cho12a/1200/800','https://picsum.photos/seed/cho12b/1200/800'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    contact: { email: 'hyunwook.cho@kaist.ac.kr', instagram: '@hyunwook.sound' },
    qrCode: { code: 'KAISTID2026-12', stampLabel: '잠 못 이루는 밤' },
    meta: { createdAt: '2026-10-01', updatedAt: '2026-11-18', isPublished: true },
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1', artistId: 'minseo-kim', workTitle: '감각의 경계: 소리로 만지는 세계',
    type: 'process', content: '진동 맵핑은 어떤 과정으로 설계하셨나요?',
    createdAt: '2026-12-03T14:22:00Z',
    answer: { content: '처음엔 주파수 대역을 단순히 신체 위아래로 나눴는데, 실제 청각 장애인 분들과 세션을 해보니 각자 원하는 맵핑이 완전히 달랐어요. 결국 조정 가능한 개인 맵핑 시스템으로 발전했습니다.', answeredAt: '2026-12-03T18:00:00Z', answeredBy: 'minseo-kim' },
    isVisible: true,
  },
  {
    id: 'q2', artistId: 'chaewon-lim', workTitle: '균사체 가구',
    type: 'material', content: '균사체 소재가 실제로 얼마나 내구성이 있나요?',
    createdAt: '2026-12-04T10:15:00Z',
    answer: { content: '압축 강도는 일반 EPS 폼의 약 1.5배입니다. 하중이 집중되는 다리 부분에는 대나무 프레임을 결합했어요.', answeredAt: '2026-12-04T15:30:00Z', answeredBy: 'chaewon-lim' },
    isVisible: true,
  },
  {
    id: 'q3', artistId: 'minjun-kang', workTitle: '친애하는 알고리즘에게',
    type: 'concept', content: '30개의 카드를 선택하는 방식은 어떤 데이터를 기반으로 하셨나요?',
    createdAt: '2026-12-05T09:00:00Z',
    answer: { content: '유튜브의 추천 시스템 구조에 관한 오픈소스 연구 데이터베이스를 참고하여, 주요 메타데이터(시청 지속시간, 클릭 등)를 추적하는 형태로 설계했습니다.', answeredAt: '2026-12-05T12:00:00Z', answeredBy: 'minjun-kang' },
    isVisible: true,
  },
  {
    id: 'q4', artistId: 'yuna-jung', workTitle: '0.033초의 진실',
    type: 'message', content: '관람자가 가져갔으면 하는 하나의 질문이 있다면?',
    createdAt: '2026-12-05T13:44:00Z', isVisible: true,
  },
  {
    id: 'q5', artistId: 'junho-lee', workTitle: '잊혀진 골목의 기억술',
    type: 'process', content: '3D 스캔 과정에서 가장 어려웠던 점은 무엇인가요?',
    createdAt: '2026-12-06T11:30:00Z',
    answer: { content: '좁은 골목길의 질감을 정확하게 스캔하는 것이 까다로웠습니다. 낮과 밤에 걸쳐 같은 지점을 반복 스캔한 뒤 병합했어요.', answeredAt: '2026-12-07T09:10:00Z', answeredBy: 'junho-lee' },
    isVisible: true,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1', artistId: 'minseo-kim', text: '소리를 몸으로 느낀다는 발상 자체가 혁명적입니다. 청각 장애인 가족이 있는데 꼭 체험시켜보고 싶어요.',
    nickname: '따뜻한 바람', color: 'yellow' as StickyColor, createdAt: '2026-12-03T15:00:00Z', posX: 15, posY: 20,
  },
  {
    id: 'c2', artistId: 'minseo-kim', text: 'AI가 개인 맵핑을 최적화한다는 게 정말 흥미롭네요. 언제 상용화될 수 있을까요?',
    nickname: '빠른 별', color: 'blue' as StickyColor, createdAt: '2026-12-04T10:00:00Z', posX: 55, posY: 30,
  },
  {
    id: 'c3', artistId: 'yuna-jung', text: '영상을 보는 내내 어느 게 진짜인지 구분하려고 안간힘을 썼어요. 신뢰에 대해 다시 생각하게 됩니다.',
    nickname: '조용한 달', color: 'pink' as StickyColor, createdAt: '2026-12-05T16:00:00Z', posX: 20, posY: 45,
  },
  {
    id: 'c4', artistId: 'minjun-kang', text: '내 알고리즘 프로필이 생성됐을 때 소름이 돋았습니다. 나는 이미 거품 안에 있었던 거겠죠.',
    nickname: '깊은 구름', color: 'green' as StickyColor, createdAt: '2026-12-06T09:00:00Z', posX: 70, posY: 15,
  },
  {
    id: 'c5', artistId: 'soyeon-park', text: '한글의 네모와 라틴의 선이 만나는 지점을 정말 우아하게 해결했어요.',
    nickname: '밝은 씨앗', color: 'yellow' as StickyColor, createdAt: '2026-12-07T11:00:00Z', posX: 30, posY: 60,
  },
];