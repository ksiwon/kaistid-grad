import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { ToastProvider } from '../components/common';
import { StampProgress, StampGrid, CompletionCard } from '../components/stamp';
import { useStamps } from '../hooks/useStamps';
import { useArtists } from '../hooks/useArtists';
import { colors, fonts, spacing, radius } from '../styles/tokens';
import { ArtistData } from '../types/artist';

const PageWrap = styled.div`
  padding-top: 80px;
`;

const PageHeader = styled.div`
  border-bottom: 1px solid ${colors.border};
`;

const PageHeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xxl} 2.5rem ${spacing.xl};

  @media (max-width: 768px) {
    padding: ${spacing.xl} 1.5rem ${spacing.lg};
  }
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 300;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
`;

const Sub = styled.p`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.14em;
  color: ${colors.textTertiary};
  text-transform: uppercase;
`;

const Content = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xxl} 2.5rem;

  @media (max-width: 768px) {
    padding: ${spacing.xl} 1.5rem;
  }
`;

const ScanBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
  padding: ${spacing.lg} ${spacing.xxl};
  background: ${colors.accentWarm};
  color: ${colors.black};
  border-radius: ${radius.md};
  font-family: ${fonts.mono};
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.85; }
`;

const Divider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: ${spacing.xxl} 0;
`;

const StampPage: React.FC = () => {
  const { stamps, isLoading } = useStamps();
  const { data: artists = [] } = useArtists();
  const navigate = useNavigate();

  const collectedCodes = stamps?.collectedCodes || [];
  const isCompleted = stamps?.isCompleted || false;

  const handleCellClick = (artist: ArtistData) => {
    navigate(`/works/${artist.id}`);
  };

  return (
    <ToastProvider>
      <Nav />
      <PageWrap>
        <PageHeader>
          <PageHeaderInner>
            <Title>Stamp Rally</Title>
            <Sub>14개 작품 QR 스캔 도전</Sub>
          </PageHeaderInner>
        </PageHeader>

        <Content>
          <StampProgress collected={collectedCodes.length} total={14} />

          <Divider />

          <StampGrid
            artists={artists}
            stampsDoc={stamps}
            newCode={null}
            onCellClick={handleCellClick}
          />

          {!isCompleted && (
            <div style={{ textAlign: 'center', marginTop: spacing.xxl }}>
              <ScanBtn to="/stamp/scan">
                📷 QR 스캔하기
              </ScanBtn>
              <p style={{
                marginTop: spacing.lg,
                fontFamily: fonts.mono,
                fontSize: '11px',
                color: colors.textTertiary,
                letterSpacing: '0.1em',
              }}>
                오프라인 전시 현장의 작품 옆 QR 코드를 스캔하세요
              </p>
            </div>
          )}

          {isCompleted && (
            <>
              <Divider />
              <CompletionCard
                completedAt={stamps?.completedAt || new Date().toISOString()}
                onDismiss={() => {}}
              />
            </>
          )}
        </Content>
      </PageWrap>
      <Footer />
    </ToastProvider>
  );
};

export default StampPage;
