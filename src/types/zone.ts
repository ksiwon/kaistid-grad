export type ZoneId = 'ai' | 'interactive' | 'design' | 'futures';

export interface ZoneConfig {
  id: ZoneId;
  label: string;
  labelKo: string;
  tagline: string;
  description: string;
  color: string;
  bgColor: string;
  floorColor: string;
  wallColor: string;
  lightColor: string;
  lightIntensity: number;
  emoji: string;
  order: number;
  atmosphere: string;
}

export const ZONE_CONFIGS: Record<ZoneId, ZoneConfig> = {
  ai: {
    id: 'ai',
    label: 'Zone A — AI',
    labelKo: 'AI 존',
    tagline: '기계는 무엇을 보는가',
    description: '알고리즘, 딥페이크, 햅틱 — 인공지능이 감각과 인식을 재정의하는 방식을 탐구한다.',
    color: '#4fc3f7',
    bgColor: '#06111a',
    floorColor: '#0d1f30',   // noticeably lighter than before
    wallColor: '#112840',
    lightColor: '#4fc3f7',
    lightIntensity: 18,
    emoji: '🤖',
    order: 0,
    atmosphere: '서버 팜 느낌. 냉각팬 저음. 푸른 LED 줄기조명.',
  },
  interactive: {
    id: 'interactive',
    label: 'Zone B — Interactive',
    labelKo: '인터랙티브 존',
    tagline: '당신의 선택이 전시다',
    description: 'UX, 감정, 수리 — 관람자의 참여 자체가 작품의 일부가 되는 공간.',
    color: '#a5d6a7',
    bgColor: '#081408',
    floorColor: '#112811',
    wallColor: '#163316',
    lightColor: '#a5d6a7',
    lightIntensity: 18,
    emoji: '✋',
    order: 1,
    atmosphere: '활동적이고 열린 공간. 따뜻한 자연광. 원형 배치.',
  },
  design: {
    id: 'design',
    label: 'Zone C — Design',
    labelKo: '디자인 존',
    tagline: '형태는 메시지다',
    description: '타이포그래피, 데이터 시각화, 그래픽 캠페인 — 시각 언어가 세계를 해석하는 방식.',
    color: '#ffe082',
    bgColor: '#141008',
    floorColor: '#221c08',
    wallColor: '#2a2208',
    lightColor: '#ffe082',
    lightIntensity: 18,
    emoji: '🎨',
    order: 2,
    atmosphere: '화이트 큐브 갤러리. 조용하고 집중된 분위기. 스팟 조명.',
  },
  futures: {
    id: 'futures',
    label: 'Zone D — Futures',
    labelKo: '퓨처스 존',
    tagline: '우리가 살아갈 공간',
    description: '공간, 환경, 지속가능성 — 다음 세대가 살아갈 도시와 물질의 미래를 그린다.',
    color: '#ffab91',
    bgColor: '#140a08',
    floorColor: '#22100a',
    wallColor: '#2a140a',
    lightColor: '#ffab91',
    lightIntensity: 18,
    emoji: '🌱',
    order: 3,
    atmosphere: '따뜻한 테라코타. 자연 소재 질감. 황혼빛 간접조명.',
  },
};

export const ZONE_ORDER: ZoneId[] = ['ai', 'interactive', 'design', 'futures'];