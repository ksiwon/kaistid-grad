import React, { useState } from 'react';
import styled from 'styled-components';
import { Question, QUESTION_TYPE_LABELS } from '../../types/question';
import { colors, fonts, spacing, radius } from '../../styles/tokens';

const Section = styled.section`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing.xl};
  margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.xl};
`;

const Empty = styled.p`
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 12px;
  text-align: center;
  padding: ${spacing.xxl} 0;
`;

const QuestionItem = styled.div`
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

const TypeTag = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${colors.accentCool};
  background: rgba(180, 196, 210, 0.1);
  padding: 3px 8px;
  border-radius: ${radius.pill};
`;

const DateLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
`;

const QuestionContent = styled.p`
  color: ${colors.textPrimary};
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: ${spacing.md};
`;

const AnswerSection = styled.div`
  background: ${colors.surfaceAlt};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  margin-top: ${spacing.md};
`;

const AnswerLabel = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.sm};
`;

const AnswerText = styled.p`
  color: ${colors.textPrimary};
  font-size: 14px;
  line-height: 1.7;
`;

const AnswerTextarea = styled.textarea`
  width: 100%;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  font-size: 14px;
  line-height: 1.7;
  resize: vertical;
  min-height: 100px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.accentWarm};
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-top: ${spacing.sm};
`;

const SmallBtn = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 7px 16px;
  border-radius: ${radius.md};
  cursor: pointer;
  border: 1px solid ${(p) => (p.$variant === 'primary' ? colors.accentWarm : colors.border)};
  background: ${(p) => (p.$variant === 'primary' ? colors.accentWarm : 'transparent')};
  color: ${(p) => (p.$variant === 'primary' ? colors.black : colors.textSecondary)};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

interface QAManagerProps {
  questions: Question[];
  artistId: string;
  onAnswer: (questionId: string, content: string) => Promise<void>;
}

const QAManager: React.FC<QAManagerProps> = ({ questions, onAnswer }) => {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const handleSubmit = async (questionId: string) => {
    const content = drafts[questionId];
    if (!content?.trim()) return;
    setSubmitting(questionId);
    try {
      await onAnswer(questionId, content);
      setDrafts((prev) => ({ ...prev, [questionId]: '' }));
      setEditing(null);
    } finally {
      setSubmitting(null);
    }
  };

  if (questions.length === 0) {
    return (
      <Section>
        <SectionTitle>Q&A 관리</SectionTitle>
        <Empty>아직 질문이 없습니다</Empty>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>Q&A 관리 — {questions.length}개의 질문</SectionTitle>
      {questions.map((q) => (
        <QuestionItem key={q.id}>
          <QuestionMeta>
            <TypeTag>{QUESTION_TYPE_LABELS[q.type]}</TypeTag>
            <DateLabel>
              {new Date(q.createdAt as unknown as string).toLocaleDateString('ko-KR')}
            </DateLabel>
          </QuestionMeta>
          <QuestionContent>{q.content}</QuestionContent>

          {q.answer ? (
            <AnswerSection>
              <AnswerLabel>내 답변</AnswerLabel>
              <AnswerText>{q.answer.content}</AnswerText>
              <BtnRow>
                <SmallBtn onClick={() => { setEditing(q.id); setDrafts((p) => ({ ...p, [q.id]: q.answer!.content })); }}>
                  수정
                </SmallBtn>
              </BtnRow>
            </AnswerSection>
          ) : (
            <AnswerSection>
              <AnswerLabel>답변 작성</AnswerLabel>
              {editing === q.id || !q.answer ? (
                <>
                  <AnswerTextarea
                    placeholder="답변을 작성하세요…"
                    value={drafts[q.id] || ''}
                    onChange={(e) => setDrafts((p) => ({ ...p, [q.id]: e.target.value }))}
                  />
                  <BtnRow>
                    <SmallBtn
                      $variant="primary"
                      onClick={() => handleSubmit(q.id)}
                      disabled={submitting === q.id || !drafts[q.id]?.trim()}
                    >
                      {submitting === q.id ? '제출 중…' : '답변 등록'}
                    </SmallBtn>
                    {editing === q.id && (
                      <SmallBtn onClick={() => setEditing(null)}>취소</SmallBtn>
                    )}
                  </BtnRow>
                </>
              ) : null}
            </AnswerSection>
          )}
        </QuestionItem>
      ))}
    </Section>
  );
};

export default QAManager;
