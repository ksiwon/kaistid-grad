export type QuestionType =
  | 'concept'
  | 'process'
  | 'material'
  | 'message'
  | 'other';

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  concept: '개념 / 기획 의도',
  process: '제작 과정',
  material: '재료 / 기술',
  message: '작품이 전하는 메시지',
  other: '기타',
};

export interface Question {
  id: string;
  artistId: string;
  workTitle: string;
  type: QuestionType;
  content: string;
  createdAt: string;

  answer?: {
    content: string;
    answeredAt: string;
    answeredBy: string;
  };

  isVisible: boolean;
}
