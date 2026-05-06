import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Question, QuestionType, QUESTION_TYPE_LABELS } from '../../types/question';
import { ArtistData } from '../../types/artist';
import { colors, fonts, breakpoints, motion } from '../../styles/tokens';
import { submitQuestion } from '../../services/questionService';
import { useUIStore } from '../../store/uiStore';
import { formatRelative } from '../../utils/formatters';

// ── QuestionForm ──────────────────────────────────────────────
interface QuestionFormProps {
  artists: ArtistData[];
  selectedArtistId: string;
  onArtistChange: (id: string) => void;
  onSubmitted: () => void;
}

const QUESTION_TYPES = Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][];

export function QuestionForm({ artists, selectedArtistId, onArtistChange, onSubmitted }: QuestionFormProps) {
  const [type, setType] = useState<QuestionType>('concept');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useUIStore();

  const selectedArtist = artists.find(a => a.id === selectedArtistId);

  const handleSubmit = async () => {
    if (!selectedArtistId || !content.trim()) {
      addToast('작품과 질문 내용을 모두 입력해주세요.', 'error');
      return;
    }
    setLoading(true);
    try {
      await submitQuestion({
        artistId: selectedArtistId,
        workTitle: selectedArtist?.work.titleKo ?? '',
        type,
        content: content.trim(),
      });
      setContent('');
      addToast('질문이 등록되었습니다.', 'success');
      onSubmitted();
    } catch {
      addToast('질문 등록에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <FormTitle>질문 남기기</FormTitle>

      <FormGroup>
        <FormLabel>작품 선택</FormLabel>
        <Select value={selectedArtistId} onChange={e => onArtistChange(e.target.value)}>
          <option value="">-- 작품을 선택하세요 --</option>
          {artists.map(a => (
            <option key={a.id} value={a.id}>
              {a.work.titleKo} · {a.name.ko}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <FormLabel>질문 유형</FormLabel>
        <TypeBtns>
          {QUESTION_TYPES.map(([value, label]) => (
            <TypeBtn
              key={value}
              $active={type === value}
              onClick={() => setType(value)}
            >
              {label}
            </TypeBtn>
          ))}
        </TypeBtns>
      </FormGroup>

      <FormGroup>
        <FormLabel>질문 내용</FormLabel>
        <Textarea
          placeholder="작품에 대한 질문을 자유롭게 남겨주세요..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
        />
        <CharCount>{content.length} / 500</CharCount>
      </FormGroup>

      <SubmitBtn
        onClick={handleSubmit}
        disabled={loading || !selectedArtistId || !content.trim()}
      >
        {loading ? '등록 중...' : '질문 남기기 →'}
      </SubmitBtn>
    </FormCard>
  );
}

const FormCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 2rem;
`;

const FormTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 22px;
  font-weight: 300;
  color: ${colors.textPrimary};
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.25rem;
`;

const FormLabel = styled.label`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const Select = styled.select`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  color: ${colors.textSecondary};
  font-family: ${fonts.body};
  font-size: 14px;
  padding: 10px 12px;
  outline: none;
  transition: border-color ${motion.fast};

  option { background: ${colors.surface}; }

  &:focus { border-color: ${colors.accentWarm}; }
`;

const TypeBtns = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TypeBtn = styled.button<{ $active: boolean }>`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid;
  cursor: pointer;
  transition: all ${motion.fast};

  ${({ $active }) => $active ? `
    background: rgba(200,168,130,0.15);
    border-color: rgba(200,168,130,0.5);
    color: ${colors.accentWarm};
  ` : `
    background: transparent;
    border-color: ${colors.border};
    color: ${colors.textTertiary};
    &:hover { border-color: ${colors.borderHover}; }
  `}
`;

const Textarea = styled.textarea`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  color: ${colors.textSecondary};
  font-family: ${fonts.body};
  font-size: 14px;
  line-height: 1.7;
  padding: 12px;
  resize: vertical;
  min-height: 120px;
  outline: none;
  transition: border-color ${motion.fast};

  &:focus { border-color: ${colors.accentWarm}; }
  &::placeholder { color: ${colors.textTertiary}; }
`;

const CharCount = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
  align-self: flex-end;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: ${colors.accentWarm};
  color: ${colors.black};
  border: none;
  border-radius: 4px;
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background ${motion.fast};

  &:hover:not(:disabled) { background: ${colors.accentWarmHover}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// ── QuestionCard ──────────────────────────────────────────────
interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <QCard>
      <QCardTop>
        <QWork>{question.workTitle}</QWork>
        <QType>{QUESTION_TYPE_LABELS[question.type]}</QType>
      </QCardTop>
      <QContent>{question.content}</QContent>
      <QCardBottom>
        <QTime>{formatRelative(question.createdAt)}</QTime>
        {question.answer && (
          <QAnswerToggle onClick={() => setExpanded(e => !e)}>
            {expanded ? '답변 접기 ↑' : '답변 보기 ↓'}
          </QAnswerToggle>
        )}
        {!question.answer && (
          <QNoAnswer>미답변</QNoAnswer>
        )}
      </QCardBottom>
      {expanded && question.answer && (
        <QAnswerBlock>
          <QAnswerLabel>작가 답변</QAnswerLabel>
          <QAnswerContent>{question.answer.content}</QAnswerContent>
        </QAnswerBlock>
      )}
    </QCard>
  );
}

const QCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 1.25rem;
  transition: border-color ${motion.fast};

  &:hover { border-color: ${colors.borderHover}; }
`;

const QCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const QWork = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.accentWarm};
`;

const QType = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
  border: 1px solid ${colors.border};
  padding: 2px 8px;
  border-radius: 999px;
`;

const QContent = styled.p`
  font-size: 15px;
  color: ${colors.textSecondary};
  line-height: 1.7;
`;

const QCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const QTime = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
`;

const QAnswerToggle = styled.button`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.accentWarm};
  background: none;
  border: none;
  cursor: pointer;
`;

const QNoAnswer = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
`;

const QAnswerBlock = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.border};
`;

const QAnswerLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${colors.accentWarm};
  display: block;
  margin-bottom: 8px;
`;

const QAnswerContent = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.7;
`;

// ── QuestionFeed ──────────────────────────────────────────────
interface QuestionFeedProps {
  questions: Question[];
  filterArtistId: string;
}

const ITEMS_PER_PAGE = 5;

export function QuestionFeed({ questions, filterArtistId }: QuestionFeedProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterArtistId]);

  const filtered = filterArtistId
    ? questions.filter(q => q.artistId === filterArtistId)
    : questions;

  if (filtered.length === 0) {
    return (
      <FeedEmpty>
        아직 질문이 없습니다. 첫 번째 질문을 남겨보세요.
      </FeedEmpty>
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <FeedWrapper>
      <FeedList>
        {paginated.map(q => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </FeedList>
      
      {totalPages > 1 && (
        <Pagination>
          <PageBtn 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ←
          </PageBtn>
          <PageInfo>
            {currentPage} / {totalPages}
          </PageInfo>
          <PageBtn 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            →
          </PageBtn>
        </Pagination>
      )}
    </FeedWrapper>
  );
}

const FeedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeedEmpty = styled.p`
  text-align: center;
  padding: 3rem;
  font-size: 14px;
  color: ${colors.textTertiary};
  border: 1px dashed ${colors.border};
  border-radius: 4px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const PageBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 14px;
  background: none;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  color: ${colors.textSecondary};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${motion.fast};

  &:hover:not(:disabled) {
    border-color: ${colors.accentWarm};
    color: ${colors.accentWarm};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
`;

// ── QAStats ──────────────────────────────────────────────
interface QAStatsProps {
  questions: Question[];
}

export function QAStats({ questions }: QAStatsProps) {
  const total = questions.length;
  const answered = questions.filter(q => q.answer).length;

  return (
    <StatsRow>
      <StatItem>
        <StatValue>{total}</StatValue>
        <StatLabel>총 질문</StatLabel>
      </StatItem>
      <StatDivider />
      <StatItem>
        <StatValue>{answered}</StatValue>
        <StatLabel>답변 완료</StatLabel>
      </StatItem>
      <StatDivider />
      <StatItem>
        <StatValue>{total - answered}</StatValue>
        <StatLabel>답변 대기</StatLabel>
      </StatItem>
    </StatsRow>
  );
}

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StatValue = styled.span`
  font-family: ${fonts.display};
  font-size: 28px;
  font-weight: 300;
  color: ${colors.textPrimary};
`;

const StatLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const StatDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${colors.border};
`;
