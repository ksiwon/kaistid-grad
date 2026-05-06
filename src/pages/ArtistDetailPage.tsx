import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { StickyBoard } from '../components/stickyBoard';
import { ZoneBadge } from '../components/zoneBadge';
import { ToastProvider } from '../components/common';
import {
  ArtistHero,
  WorkStatement,
  MediaGallery,
  ProcessNote,
  ArtistQA,
} from '../components/artist';
import { useArtist } from '../hooks/useArtist';
import { useArtists } from '../hooks/useArtists';
import { useQuestions } from '../hooks/useQuestions';
import { colors, fonts, spacing } from '../styles/tokens';

const PageWrap = styled.div`
  padding-top: 72px;
`;

const StickyBoardSection = styled.section`
  border-top: 1px solid ${colors.border};
  padding: 60px 0;
`;

const StickyBoardInner = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 0 2.5rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const StickyBoardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: wrap;
`;

const StickyBoardTitle = styled.h3`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  margin-bottom: 4px;
`;

const StickyBoardDesc = styled.p`
  font-size: 13px;
  color: ${colors.textSecondary};
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg} 2.5rem;
  border-bottom: 1px solid ${colors.border};

  @media (max-width: 768px) {
    padding: ${spacing.lg} 1.5rem;
  }
`;

const BackBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  transition: color 0.2s ease;

  &:hover { color: ${colors.textPrimary}; }
`;

const PrevNext = styled.div`
  display: flex;
  gap: ${spacing.xl};
`;

const PrevNextBtn = styled.button<{ $disabled?: boolean }>`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${(p) => (p.$disabled ? colors.textTertiary : colors.textSecondary)};
  background: none;
  border: none;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  padding: 0;
  transition: color 0.2s ease;

  &:hover { color: ${(p) => (p.$disabled ? colors.textTertiary : colors.textPrimary)}; }
`;

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: ${spacing.lg};
`;

const ArtistDetailPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const { data: artist, isLoading } = useArtist(artistId || '');
  const { questions = [] } = useQuestions(artistId);
  const { data: allArtists = [] } = useArtists();

  const sorted = [...allArtists].sort((a, b) => a.order - b.order);
  const currentIdx = sorted.findIndex((a) => a.id === artistId);
  const prev = currentIdx > 0 ? sorted[currentIdx - 1] : null;
  const next = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;

  if (isLoading) {
    return (
      <>
        <Nav />
        <Loading>Loading...</Loading>
      </>
    );
  }

  if (!artist) {
    return (
      <>
        <Nav />
        <NotFound>
          <p style={{ color: colors.textTertiary, fontFamily: fonts.mono }}>작품을 찾을 수 없습니다</p>
          <BackBtn onClick={() => navigate('/works')}>← Works로 돌아가기</BackBtn>
        </NotFound>
      </>
    );
  }

  return (
    <ToastProvider>
      <Nav />
      <PageWrap>
        <NavRow>
          <BackBtn onClick={() => navigate('/works')}>← 전체 작품</BackBtn>
          <PrevNext>
            <PrevNextBtn
              $disabled={!prev}
              onClick={() => prev && navigate(`/works/${prev.id}`)}
            >
              ← {prev ? prev.name.ko : '–'}
            </PrevNextBtn>
            <PrevNextBtn
              $disabled={!next}
              onClick={() => next && navigate(`/works/${next.id}`)}
            >
              {next ? next.name.ko : '–'} →
            </PrevNextBtn>
          </PrevNext>
        </NavRow>

        <ArtistHero artist={artist} />
        <WorkStatement artist={artist} />
        <MediaGallery artist={artist} />
        {(artist.work.processNoteKo || (artist.media.processImages && artist.media.processImages.length > 0)) && (
          <ProcessNote artist={artist} />
        )}
        <ArtistQA artistId={artist.id} questions={questions} />
        <StickyBoardSection>
          <StickyBoardInner>
            <StickyBoardHeader>
              <div>
                <StickyBoardTitle>관람객 노트</StickyBoardTitle>
                <StickyBoardDesc>이 작품을 보고 떠오른 생각을 포스트잇에 남겨보세요.</StickyBoardDesc>
              </div>
              <ZoneBadge zoneId={artist.zone} />
            </StickyBoardHeader>
            <StickyBoard artistId={artist.id} />
          </StickyBoardInner>
        </StickyBoardSection>
      </PageWrap>
      <Footer />
    </ToastProvider>
  );
};

export default ArtistDetailPage;