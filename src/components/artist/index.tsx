import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArtistData } from '../../types/artist';
import { Question } from '../../types/question';
import { colors, fonts, breakpoints, motion } from '../../styles/tokens';
import { CategoryTag } from '../common/index';
import { formatRelative } from '../../utils/formatters';
import { QUESTION_TYPE_LABELS } from '../../types/question';

// ── ArtistHero ──────────────────────────────────────────────
interface ArtistHeroProps {
  artist: ArtistData;
  prevId?: string;
  nextId?: string;
}

export function ArtistHero({ artist, prevId, nextId }: ArtistHeroProps) {
  const navigate = useNavigate();

  return (
    <HeroWrap>
      <HeroImage src={artist.media.heroUrl} alt={artist.work.titleKo} />
      <HeroOverlay>
        <HeroTitle>{artist.work.titleKo}</HeroTitle>
        <HeroTitleEn>{artist.work.titleEn}</HeroTitleEn>
      </HeroOverlay>

      <NavRow>
        <NavBtn onClick={() => navigate('/works')}>← 전체 작품</NavBtn>
        <NavBtns>
          {prevId && <NavBtn onClick={() => navigate(`/works/${prevId}`)}>← 이전</NavBtn>}
          {nextId && <NavBtn onClick={() => navigate(`/works/${nextId}`)}>다음 →</NavBtn>}
        </NavBtns>
      </NavRow>
    </HeroWrap>
  );
}

const HeroWrap = styled.div`
  position: relative;
`;

const HeroImage = styled.img`
  width: 100%;
  aspect-ratio: 16/7;
  object-fit: cover;

  @media (max-width: ${breakpoints.tablet}) {
    aspect-ratio: 4/3;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3rem 2.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 2rem 1.5rem;
  }
`;

const HeroTitle = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(32px, 5vw, 72px);
  font-weight: 300;
  color: ${colors.textPrimary};
  line-height: 1.1;
`;

const HeroTitleEn = styled.p`
  font-family: ${fonts.display};
  font-size: clamp(14px, 2vw, 22px);
  font-weight: 300;
  color: ${colors.textSecondary};
  font-style: italic;
  margin-top: 8px;
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2.5rem;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.surface};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 1rem 1.5rem;
  }
`;

const NavBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${colors.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: color ${motion.fast};

  &:hover { color: ${colors.accentWarm}; }
`;

const NavBtns = styled.div`
  display: flex;
  gap: 1.5rem;
`;

// ── WorkStatement ──────────────────────────────────────────────
interface WorkStatementProps {
  artist: ArtistData;
}

export function WorkStatement({ artist }: WorkStatementProps) {
  const [tab, setTab] = useState<'ko' | 'en'>('ko');

  return (
    <StatementWrap>
      <StatementLeft>
        <ArtistInfoBlock>
          <InfoLabel>작가</InfoLabel>
          <InfoValue>{artist.name.ko}</InfoValue>
          <InfoValueSub>{artist.name.en}</InfoValueSub>
        </ArtistInfoBlock>
        <ArtistInfoBlock>
          <InfoLabel>학번</InfoLabel>
          <InfoValue>{artist.studentId}</InfoValue>
        </ArtistInfoBlock>
        <ArtistInfoBlock>
          <InfoLabel>분야</InfoLabel>
          <CategoryTag category={artist.category} />
        </ArtistInfoBlock>
        {artist.work.keywords.length > 0 && (
          <ArtistInfoBlock>
            <InfoLabel>키워드</InfoLabel>
            <KeywordList>
              {artist.work.keywords.map(kw => (
                <Keyword key={kw}>{kw}</Keyword>
              ))}
            </KeywordList>
          </ArtistInfoBlock>
        )}
        <ContactBlock>
          <InfoLabel>연락처</InfoLabel>
          {artist.contact.email && (
            <ContactLink href={`mailto:${artist.contact.email}`} target="_blank">
              Email ↗
            </ContactLink>
          )}
          {artist.contact.instagram && (
            <ContactLink href={`https://instagram.com/${artist.contact.instagram.replace('@', '')}`} target="_blank">
              Instagram ↗
            </ContactLink>
          )}
          {artist.contact.behance && (
            <ContactLink href={`https://behance.net/${artist.contact.behance}`} target="_blank">
              Behance ↗
            </ContactLink>
          )}
          {artist.contact.website && (
            <ContactLink href={`https://${artist.contact.website}`} target="_blank">
              Website ↗
            </ContactLink>
          )}
        </ContactBlock>
      </StatementLeft>

      <StatementRight>
        <TabRow>
          <TabBtn $active={tab === 'ko'} onClick={() => setTab('ko')}>한국어</TabBtn>
          {artist.work.statementEn && (
            <TabBtn $active={tab === 'en'} onClick={() => setTab('en')}>English</TabBtn>
          )}
        </TabRow>
        <StatementText>
          {(tab === 'ko' ? artist.work.statementKo : artist.work.statementEn)
            ?.split('\n\n')
            .map((para, i) => <p key={i}>{para}</p>)
          }
        </StatementText>
      </StatementRight>
    </StatementWrap>
  );
}

const StatementWrap = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 4rem;
  padding: 4rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: ${breakpoints.desktop}) {
    grid-template-columns: 220px 1fr;
    gap: 2.5rem;
  }

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    padding: 2.5rem 1.5rem;
  }
`;

const StatementLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ArtistInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const InfoValue = styled.span`
  font-size: 15px;
  color: ${colors.textPrimary};
`;

const InfoValueSub = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.textTertiary};
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Keyword = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
  border: 1px solid ${colors.border};
  padding: 3px 8px;
  border-radius: 2px;
`;

const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ContactLink = styled.a`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  color: ${colors.accentWarm};
  transition: opacity ${motion.fast};

  &:hover { opacity: 0.7; }
`;

const StatementRight = styled.div``;

const TabRow = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${colors.border};
`;

const TabBtn = styled.button<{ $active: boolean }>`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 10px 18px;
  background: none;
  border: none;
  border-bottom: 2px solid;
  cursor: pointer;
  transition: all ${motion.fast};
  margin-bottom: -1px;

  ${({ $active }) => $active ? `
    color: ${colors.textPrimary};
    border-bottom-color: ${colors.accentWarm};
  ` : `
    color: ${colors.textTertiary};
    border-bottom-color: transparent;
    &:hover { color: ${colors.textSecondary}; }
  `}
`;

const StatementText = styled.div`
  font-size: 16px;
  color: ${colors.textSecondary};
  line-height: 1.9;

  p + p { margin-top: 1.25rem; }
`;

// ── MediaGallery ──────────────────────────────────────────────
interface MediaGalleryProps {
  artist: ArtistData;
}

export function MediaGallery({ artist }: MediaGalleryProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = artist.media.images;

  if (images.length === 0) return null;

  const prev = () => setCurrentIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrentIdx(i => (i + 1) % images.length);

  return (
    <GalleryWrap>
      <GalleryHeader>
        <GalleryLabel>갤러리</GalleryLabel>
        <GalleryCount>{String(currentIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</GalleryCount>
      </GalleryHeader>

      <GalleryMain>
        <GalleryImg src={images[currentIdx]} alt={`갤러리 ${currentIdx + 1}`} />
        <GalleryPrev onClick={prev} aria-label="이전">‹</GalleryPrev>
        <GalleryNext onClick={next} aria-label="다음">›</GalleryNext>
      </GalleryMain>

      <GalleryThumbs>
        {images.map((img, i) => (
          <GalleryThumb
            key={i}
            src={img}
            alt=""
            $active={i === currentIdx}
            onClick={() => setCurrentIdx(i)}
          />
        ))}
      </GalleryThumbs>

      {artist.media.videoUrl && (
        <VideoEmbed>
          <iframe
            src={artist.media.videoUrl}
            title="작품 영상"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoEmbed>
      )}
    </GalleryWrap>
  );
}

const GalleryWrap = styled.section`
  padding: 4rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 2.5rem 1.5rem;
  }
`;

const GalleryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const GalleryLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const GalleryCount = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.textTertiary};
`;

const GalleryMain = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const GalleryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity ${motion.base};
`;

const GalleryNavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(10,10,10,0.7);
  border: 1px solid ${colors.border};
  color: ${colors.textPrimary};
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: background ${motion.fast};

  &:hover { background: rgba(10,10,10,0.9); }
`;

const GalleryPrev = styled(GalleryNavBtn)` left: 1rem; `;
const GalleryNext = styled(GalleryNavBtn)` right: 1rem; `;

const GalleryThumbs = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const GalleryThumb = styled.img<{ $active: boolean }>`
  width: 72px;
  height: 54px;
  object-fit: cover;
  border-radius: 2px;
  cursor: pointer;
  border: 2px solid ${({ $active }) => $active ? colors.accentWarm : 'transparent'};
  opacity: ${({ $active }) => $active ? 1 : 0.5};
  transition: all ${motion.fast};
  flex-shrink: 0;

  &:hover { opacity: 1; }
`;

const VideoEmbed = styled.div`
  margin-top: 2rem;
  aspect-ratio: 16/9;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${colors.border};

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

// ── ProcessNote ──────────────────────────────────────────────
interface ProcessNoteProps {
  artist: ArtistData;
}

export function ProcessNote({ artist }: ProcessNoteProps) {
  if (!artist.work.processNoteKo && !artist.media.processImages?.length) return null;

  return (
    <ProcessWrap>
      <ProcessLabel>제작 과정</ProcessLabel>
      {artist.work.processNoteKo && (
        <ProcessText>
          {artist.work.processNoteKo.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </ProcessText>
      )}
      {artist.media.processImages && artist.media.processImages.length > 0 && (
        <ProcessImgGrid>
          {artist.media.processImages.map((img, i) => (
            <ProcessImg key={i} src={img} alt={`제작 과정 ${i + 1}`} loading="lazy" />
          ))}
        </ProcessImgGrid>
      )}
    </ProcessWrap>
  );
}

const ProcessWrap = styled.section`
  padding: 4rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 2.5rem 1.5rem;
  }
`;

const ProcessLabel = styled.h2`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  margin-bottom: 2rem;
`;

const ProcessText = styled.div`
  font-size: 15px;
  color: ${colors.textSecondary};
  line-height: 1.9;
  max-width: 680px;
  margin-bottom: 2rem;

  p + p { margin-top: 1rem; }
`;

const ProcessImgGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const ProcessImg = styled.img`
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid ${colors.border};
`;

// ── ArtistQA ──────────────────────────────────────────────
interface ArtistQAProps {
  artistId: string;
  questions: Question[];
}

export function ArtistQA({ artistId, questions }: ArtistQAProps) {
  const navigate = useNavigate();
  const artistQuestions = questions.filter(q => q.artistId === artistId).slice(0, 5);

  return (
    <ArtistQAWrap>
      <ArtistQAHeader>
        <ArtistQALabel>Q & A</ArtistQALabel>
        <ArtistQAViewAll onClick={() => navigate('/qa')}>
          전체 보기 →
        </ArtistQAViewAll>
      </ArtistQAHeader>

      {artistQuestions.length === 0 ? (
        <ArtistQAEmpty>
          이 작품에 대한 첫 번째 질문을 남겨보세요.
          <ArtistQABtn onClick={() => navigate('/qa')}>질문하기 →</ArtistQABtn>
        </ArtistQAEmpty>
      ) : (
        <ArtistQAList>
          {artistQuestions.map(q => (
            <ArtistQACard key={q.id}>
              <QAType>{QUESTION_TYPE_LABELS[q.type]}</QAType>
              <QAContent>{q.content}</QAContent>
              {q.answer && (
                <QAAnswerBlock>
                  <QAAnswerLabel>작가 답변</QAAnswerLabel>
                  <QAAnswerContent>{q.answer.content}</QAAnswerContent>
                </QAAnswerBlock>
              )}
              <QATime>{formatRelative(q.createdAt)}</QATime>
            </ArtistQACard>
          ))}
          <ArtistQABtn onClick={() => navigate('/qa')}>더 많은 질문 보기 →</ArtistQABtn>
        </ArtistQAList>
      )}
    </ArtistQAWrap>
  );
}

const ArtistQAWrap = styled.section`
  padding: 4rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 2.5rem 1.5rem;
  }
`;

const ArtistQAHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const ArtistQALabel = styled.h2`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const ArtistQAViewAll = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${colors.accentWarm};
  background: none;
  border: none;
  cursor: pointer;

  &:hover { opacity: 0.7; }
`;

const ArtistQAEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
  border: 1px dashed ${colors.border};
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  color: ${colors.textTertiary};
`;

const ArtistQAList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ArtistQACard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 1.25rem;
`;

const QAType = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${colors.textTertiary};
  display: block;
  margin-bottom: 8px;
`;

const QAContent = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.7;
`;

const QAAnswerBlock = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.border};
`;

const QAAnswerLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${colors.accentWarm};
  display: block;
  margin-bottom: 8px;
`;

const QAAnswerContent = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.7;
`;

const QATime = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
  display: block;
  margin-top: 10px;
`;

const ArtistQABtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  color: ${colors.accentWarm};
  background: none;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  padding: 0;

  &:hover { opacity: 0.7; }
`;
