export interface Comment {
  id: string;
  artistId: string;
  text: string;
  nickname: string;
  color: StickyColor;
  createdAt: string;
  // position on the board (0-100 percent, so it's responsive)
  posX: number;
  posY: number;
}

export type StickyColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange';

export const STICKY_COLORS: Record<StickyColor, { bg: string; text: string; border: string }> = {
  yellow: { bg: '#fffacd', text: '#5a4a00', border: '#e6d44a' },
  pink:   { bg: '#ffe4f0', text: '#5a0030', border: '#e66aa0' },
  blue:   { bg: '#dceeff', text: '#003060', border: '#4a90d4' },
  green:  { bg: '#d8f5e0', text: '#003a18', border: '#4ab870' },
  orange: { bg: '#ffe8d0', text: '#4a1a00', border: '#e67a30' },
};

export const STICKY_COLOR_LIST: StickyColor[] = ['yellow', 'pink', 'blue', 'green', 'orange'];

// Adjectives + nouns for auto-generating anonymous nicknames
const ADJ = ['반짝이는', '조용한', '빠른', '느린', '파란', '붉은', '따뜻한', '차가운', '깊은', '밝은'];
const NOUN = ['달', '별', '파도', '바람', '구름', '숲', '돌', '새', '빛', '씨앗'];

export function generateNickname(): string {
  const a = ADJ[Math.floor(Math.random() * ADJ.length)];
  const n = NOUN[Math.floor(Math.random() * NOUN.length)];
  return `${a} ${n}`;
}