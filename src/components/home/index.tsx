import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { colors, fonts, breakpoints } from '../../styles/tokens';
import { ArtistData } from '../../types/artist';
import WorkCard from '../works/WorkCard';
import { Question } from '../../types/question';
import { QUESTION_TYPE_LABELS } from '../../types/question';
import { formatRelative } from '../../utils/formatters';

// ── Hero Section ──────────────────────────────────────────────
const revealY = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <HeroWrap>
      <GridOverlay />
      <HeroContent>
        <HeroEyebrow>
          <EyebrowLine />
          <EyebrowText>2026 · KAIST · 산업디자인학과</EyebrowText>
        </HeroEyebrow>

        <HeroTitleWrap>
          <ClipWrap style={{ animationDelay: '0.1s' }}>
            <HeroTitle>졸업전시</HeroTitle>
          </ClipWrap>
          <ClipWrap style={{ animationDelay: '0.22s' }}>
            <HeroTitleEn>Graduate Exhibition</HeroTitleEn>
          </ClipWrap>
        </HeroTitleWrap>

        <HeroSub style={{ animationDelay: '0.42s' }}>
          14인의 디자인 졸업전시 — 세지화랑, 서울
        </HeroSub>

        <HeroInfoRow style={{ animationDelay: '0.55s' }}>
          <HeroInfoItem>
            <HeroInfoLabel>기간</HeroInfoLabel>
            <HeroInfoValue>2026.12.02 – 12.12</HeroInfoValue>
          </HeroInfoItem>
          <HeroInfoItem>
            <HeroInfoLabel>시간</HeroInfoLabel>
            <HeroInfoValue>10:00 – 18:00</HeroInfoValue>
          </HeroInfoItem>
          <HeroInfoItem>
            <HeroInfoLabel>장소</HeroInfoLabel>
            <HeroInfoValue>세지화랑 B1, 종로구</HeroInfoValue>
          </HeroInfoItem>
        </HeroInfoRow>

        <HeroCTA style={{ animationDelay: '0.65s' }}>
          <CTABtn $primary onClick={() => navigate('/works')}>
            작품 보기 →
          </CTABtn>
          <CTABtn onClick={() => navigate('/about')}>
            전시 정보
          </CTABtn>
        </HeroCTA>
      </HeroContent>

      <ScrollHint>
        <ScrollLine />
        <ScrollLabel>scroll</ScrollLabel>
      </ScrollHint>
    </HeroWrap>
  );
}

const HeroWrap = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 8rem 0 5rem;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 7rem 0 4rem;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(232, 228, 220, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 228, 220, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
`;

const HeroContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 0 2.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 0 1.5rem;
  }
`;

const HeroEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease both;
`;

const EyebrowLine = styled.div`
  width: 40px;
  height: 1px;
  background: ${colors.accentWarm};
`;

const EyebrowText = styled.span`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
`;

const HeroTitleWrap = styled.div`
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const ClipWrap = styled.div`
  overflow: hidden;
  animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
`;

const HeroTitle = styled.h1`
  font-family: ${fonts.display};
  font-size: ${`clamp(72px, 12vw, 140px)`};
  font-weight: 300;
  line-height: 1.0;
  color: ${colors.textPrimary};
  letter-spacing: -0.02em;
`;

const HeroTitleEn = styled.h2`
  font-family: ${fonts.display};
  font-size: ${`clamp(28px, 4.5vw, 56px)`};
  font-weight: 300;
  line-height: 1.1;
  color: ${colors.textTertiary};
  font-style: italic;
  letter-spacing: 0.02em;
`;

const HeroSub = styled.p`
  font-family: ${fonts.mono};
  font-size: 13px;
  letter-spacing: 0.12em;
  color: ${colors.textSecondary};
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.6s ease both;
`;

const HeroInfoRow = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.6s ease both;
  flex-wrap: wrap;
`;

const HeroInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeroInfoLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const HeroInfoValue = styled.span`
  font-size: 14px;
  color: ${colors.textSecondary};
`;

const HeroCTA = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease both;
`;

const CTABtn = styled.button<{ $primary?: boolean }>`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 12px 28px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $primary }) => $primary ? `
    background: ${colors.accentWarm};
    color: ${colors.black};
    border: 1px solid ${colors.accentWarm};
    &:hover { background: #d4b896; }
  ` : `
    background: transparent;
    color: ${colors.textPrimary};
    border: 1px solid ${colors.border};
    &:hover { border-color: ${colors.borderHover}; }
  `}
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2.5rem;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const ScrollLine = styled.div`
  width: 40px;
  height: 1px;
  background: ${colors.textTertiary};
`;

const ScrollLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

// ── Featured Works ──────────────────────────────────────────────
interface FeaturedWorksProps {
  artists: ArtistData[];
}

export function FeaturedWorks({ artists }: FeaturedWorksProps) {
  const navigate = useNavigate();
  const featured = artists.slice(0, 6);

  return (
    <FeaturedWrap>
      <FeaturedHeader>
        <FeaturedLabel>Featured Works</FeaturedLabel>
        <FeaturedTitle>14인의 작품</FeaturedTitle>
        <ViewAll onClick={() => navigate('/works')}>
          전체 작품 보기 →
        </ViewAll>
      </FeaturedHeader>
      <WorksGrid>
        {featured.map((artist, i) => (
          <WorkCard key={artist.id} artist={artist} index={i} />
        ))}
      </WorksGrid>
    </FeaturedWrap>
  );
}

const FeaturedWrap = styled.section`
  padding: 5rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

const FeaturedHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
`;

const FeaturedLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const FeaturedTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 32px;
  font-weight: 300;
  color: ${colors.textPrimary};
`;

const ViewAll = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  color: ${colors.accentWarm};
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  transition: opacity 0.2s;

  &:hover { opacity: 0.7; }
`;

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

// ── About Teaser ──────────────────────────────────────────────
export function AboutTeaser() {
  const navigate = useNavigate();

  return (
    <AboutWrap>
      <AboutContent>
        <AboutLabel>오프라인 전시</AboutLabel>
        <AboutTitle>세지화랑에서<br />만나보세요</AboutTitle>
        <AboutGrid>
          <AboutItem>
            <AboutItemLabel>기간</AboutItemLabel>
            <AboutItemValue>2026.12.02(수) – 12.12(토)</AboutItemValue>
          </AboutItem>
          <AboutItem>
            <AboutItemLabel>시간</AboutItemLabel>
            <AboutItemValue>오전 10:00 – 오후 6:00</AboutItemValue>
          </AboutItem>
          <AboutItem>
            <AboutItemLabel>장소</AboutItemLabel>
            <AboutItemValue>서울 종로구 북촌로4길 27, 지하 1층</AboutItemValue>
          </AboutItem>
          <AboutItem>
            <AboutItemLabel>입장</AboutItemLabel>
            <AboutItemValue>무료 · Walk-in (일·월 휴관)</AboutItemValue>
          </AboutItem>
        </AboutGrid>
        <AboutBtn onClick={() => navigate('/about')}>
          오시는 길 →
        </AboutBtn>
      </AboutContent>

      <MapPlaceholder style={{ display: 'block', cursor: 'auto' }}>
        <iframe 
          src="https://maps.google.com/maps?q=서울%20종로구%20북촌로4길%2027&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0, borderRadius: '3px' }} 
          loading="lazy" 
          title="세지화랑 위치"
        />
      </MapPlaceholder>
    </AboutWrap>
  );
}

const AboutWrap = styled.section`
  border-top: 1px solid ${colors.border};
  border-bottom: 1px solid ${colors.border};
  padding: 5rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 1.5rem;
  }
`;

const AboutContent = styled.div``;

const AboutLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  display: block;
  margin-bottom: 1rem;
`;

const AboutTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 300;
  color: ${colors.textPrimary};
  line-height: 1.2;
  margin-bottom: 2rem;
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const AboutItem = styled.div``;

const AboutItemLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  display: block;
  margin-bottom: 4px;
`;

const AboutItemValue = styled.span`
  font-size: 14px;
  color: ${colors.textSecondary};
`;

const AboutBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;

  &:hover { opacity: 0.7; }
`;

const MapPlaceholder = styled.div`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover { border-color: ${colors.borderHover}; }
`;

const MapIcon = styled.div`
  font-size: 2.5rem;
`;

const MapText = styled.p`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.06em;
  color: ${colors.textSecondary};
  text-align: center;
  line-height: 1.6;
`;

const MapBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  border: 1px solid rgba(200,168,130,0.3);
  background: none;
  padding: 6px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: rgba(200,168,130,0.1); }
`;

// ── QA Teaser ──────────────────────────────────────────────
interface QATeaserProps {
  questions: Question[];
}

export function QATeaser({ questions }: QATeaserProps) {
  const navigate = useNavigate();
  const recent = questions.slice(0, 3);

  return (
    <QATeaserWrap>
      <QATeaserLeft>
        <QALabel>Q & A</QALabel>
        <QATitle>작가에게<br />질문하세요</QATitle>
        <QADesc>
          작품에 대해 궁금한 점을 남기면<br />
          작가가 직접 답변합니다.
        </QADesc>
        <QABtn onClick={() => navigate('/qa')}>Q&A 바로가기 →</QABtn>
      </QATeaserLeft>

      <QATeaserRight>
        {recent.length === 0 ? (
          <QAEmpty>아직 질문이 없습니다. 첫 번째 질문을 남겨보세요.</QAEmpty>
        ) : (
          recent.map(q => (
            <QACard key={q.id} onClick={() => navigate('/qa')}>
              <QACardWork>{q.workTitle}</QACardWork>
              <QACardContent>{q.content}</QACardContent>
              <QACardMeta>
                <QACardType>{QUESTION_TYPE_LABELS[q.type]}</QACardType>
                <QACardTime>{formatRelative(q.createdAt)}</QACardTime>
                {q.answer && <QAAnswered>답변 완료</QAAnswered>}
              </QACardMeta>
            </QACard>
          ))
        )}
      </QATeaserRight>
    </QATeaserWrap>
  );
}

const QATeaserWrap = styled.section`
  padding: 5rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 1.5rem;
  }
`;

const QATeaserLeft = styled.div``;

const QALabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  display: block;
  margin-bottom: 1rem;
`;

const QATitle = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 300;
  color: ${colors.textPrimary};
  line-height: 1.2;
  margin-bottom: 1rem;
`;

const QADesc = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const QABtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover { opacity: 0.7; }
`;

const QATeaserRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QACard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover { border-color: ${colors.borderHover}; }
`;

const QACardWork = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${colors.accentWarm};
  display: block;
  margin-bottom: 8px;
`;

const QACardContent = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 12px;
`;

const QACardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QACardType = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
`;

const QACardTime = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
  margin-left: auto;
`;

const QAAnswered = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.success};
  letter-spacing: 0.1em;
`;

const QAEmpty = styled.p`
  font-size: 14px;
  color: ${colors.textTertiary};
  padding: 2rem;
  text-align: center;
  border: 1px dashed ${colors.border};
  border-radius: 4px;
`;
