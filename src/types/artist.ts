export type ArtworkCategory =
  | 'ux-interaction'
  | 'space-environment'
  | 'visual-graphic'
  | 'product-industrial'
  | 'media-video'
  | 'concept-research';

export const CATEGORY_LABELS: Record<ArtworkCategory, string> = {
  'ux-interaction': 'UX · 인터랙션',
  'space-environment': '공간 · 환경',
  'visual-graphic': '비주얼 · 그래픽',
  'product-industrial': '제품 · 산업',
  'media-video': '미디어 · 영상',
  'concept-research': '개념 · 연구',
};

export interface ArtistData {
  id: string;
  order: number;
  name: { ko: string; en: string };
  studentId: string;
  category: ArtworkCategory;

  work: {
    titleKo: string;
    titleEn: string;
    statementKo: string;
    statementEn?: string;
    processNoteKo?: string;
    processNoteEn?: string;
    keywords: string[];
    oneLineKo?: string;
  };

  media: {
    thumbnailUrl: string;
    heroUrl: string;
    images: string[];
    videoUrl?: string;
    processImages?: string[];
  };

  contact: {
    email?: string;
    instagram?: string;
    behance?: string;
    website?: string;
  };

  qrCode: {
    code: string;
    stampLabel: string;
  };

  meta: {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    isPublished: boolean;
  };
}
