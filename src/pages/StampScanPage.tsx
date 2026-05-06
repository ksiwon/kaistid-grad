import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Nav from '../components/common/Nav';
import { QRScanner } from '../components/stamp';
import { useStamps } from '../hooks/useStamps';
import { useArtists } from '../hooks/useArtists';
import { colors, fonts, spacing, radius } from '../styles/tokens';

const stampIn = keyframes`
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const PageWrap = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 540px;
  padding: ${spacing.xl};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatusCard = styled.div<{ $type: 'success' | 'duplicate' | 'error' | 'scanning' }>`
  width: 100%;
  background: ${colors.surface};
  border: 1px solid ${(p) => {
    if (p.$type === 'success') return colors.success;
    if (p.$type === 'error') return colors.error;
    if (p.$type === 'duplicate') return colors.border;
    return colors.border;
  }};
  border-radius: ${radius.lg};
  padding: ${spacing.xxl};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const StampMark = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${colors.accentWarm};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.xl};
  animation: ${stampIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  svg {
    width: 50px;
    height: 50px;
    color: ${colors.black};
  }
`;

const BigEmoji = styled.div`
  font-size: 64px;
  margin-bottom: ${spacing.lg};
`;

const StatusTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 28px;
  font-weight: 300;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.md};
`;

const StatusSub = styled.p`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  color: ${colors.textSecondary};
  margin-bottom: ${spacing.xl};
`;

const ArtistName = styled.p`
  font-family: ${fonts.display};
  font-size: 22px;
  font-weight: 300;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.sm};
`;

const BtnRow = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const Btn = styled(Link)<{ $variant?: 'primary' | 'outline' }>`
  padding: ${spacing.md} ${spacing.xl};
  border-radius: ${radius.md};
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid ${(p) => (p.$variant === 'primary' ? colors.accentWarm : colors.border)};
  background: ${(p) => (p.$variant === 'primary' ? colors.accentWarm : 'transparent')};
  color: ${(p) => (p.$variant === 'primary' ? colors.black : colors.textSecondary)};
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.8; }
`;

const ScanTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 32px;
  font-weight: 300;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
  text-align: center;
`;

const ScanSub = styled.p`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  color: ${colors.textTertiary};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const StampScanPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  const { stamps, addStamp } = useStamps();
  const { data: artists = [] } = useArtists();

  const [status, setStatus] = useState<'scanning' | 'processing' | 'success' | 'duplicate' | 'error'>('scanning');
  const [scannedArtist, setScannedArtist] = useState<typeof artists[0] | null>(null);

  useEffect(() => {
    if (code) {
      processCode(code);
    }
  }, [code]);

  const processCode = async (qrCode: string) => {
    setStatus('processing');
    const artist = artists.find((a) => a.qrCode.code === qrCode);

    if (!artist) {
      setStatus('error');
      return;
    }

    setScannedArtist(artist);
    const collected = stamps?.collectedCodes || [];

    if (collected.includes(qrCode)) {
      setStatus('duplicate');
      return;
    }

    try {
      await addStamp(qrCode);
      setStatus('success');

      // Redirect to stamp page after 3 seconds
      setTimeout(() => navigate('/stamp'), 3000);
    } catch {
      setStatus('error');
    }
  };

  const handleScan = (result: string) => {
    try {
      const url = new URL(result);
      const scannedCode = url.searchParams.get('code');
      if (scannedCode) {
        navigate(`/stamp/scan?code=${scannedCode}`);
      }
    } catch {
      // not a valid URL, try as direct code
      if (result.startsWith('KAISTID2026-')) {
        navigate(`/stamp/scan?code=${result}`);
      }
    }
  };

  return (
    <>
      <Nav />
      <PageWrap>
        <Content>
          {(status === 'scanning' || status === 'processing') && !code && (
            <>
              <ScanTitle>QR 스캔</ScanTitle>
              <ScanSub>카메라를 작품 옆 QR 코드에 가져다 대세요</ScanSub>
              <QRScanner onScan={handleScan} />
              <BtnRow style={{ marginTop: spacing.xl }}>
                <Btn to="/stamp">← 스탬프 현황 보기</Btn>
              </BtnRow>
            </>
          )}

          {status === 'processing' && code && (
            <StatusCard $type="scanning">
              <BigEmoji>⏳</BigEmoji>
              <StatusTitle>확인 중…</StatusTitle>
            </StatusCard>
          )}

          {status === 'success' && scannedArtist && (
            <StatusCard $type="success">
              <StampMark>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </StampMark>
              <StatusTitle>스탬프 획득!</StatusTitle>
              <ArtistName>{scannedArtist.name.ko}</ArtistName>
              <StatusSub>
                {scannedArtist.work.titleKo}<br />
                잠시 후 스탬프 페이지로 이동합니다
              </StatusSub>
              <BtnRow>
                <Btn to={`/works/${scannedArtist.id}`} $variant="outline">작품 보기</Btn>
                <Btn to="/stamp" $variant="primary">스탬프 현황</Btn>
              </BtnRow>
            </StatusCard>
          )}

          {status === 'duplicate' && scannedArtist && (
            <StatusCard $type="duplicate">
              <BigEmoji>📌</BigEmoji>
              <StatusTitle>이미 방문한 작품이에요</StatusTitle>
              <ArtistName>{scannedArtist.name.ko}</ArtistName>
              <StatusSub>{scannedArtist.work.titleKo}</StatusSub>
              <BtnRow>
                <Btn to={`/works/${scannedArtist.id}`}>작품 자세히 보기</Btn>
                <Btn to="/stamp" $variant="primary">스탬프 현황</Btn>
              </BtnRow>
            </StatusCard>
          )}

          {status === 'error' && (
            <StatusCard $type="error">
              <BigEmoji>❌</BigEmoji>
              <StatusTitle>유효하지 않은 QR 코드</StatusTitle>
              <StatusSub>올바른 전시 QR 코드를 스캔해 주세요</StatusSub>
              <BtnRow>
                <Btn to="/stamp/scan" $variant="primary">다시 스캔</Btn>
                <Btn to="/stamp">스탬프 현황</Btn>
              </BtnRow>
            </StatusCard>
          )}
        </Content>
      </PageWrap>
    </>
  );
};

export default StampScanPage;
