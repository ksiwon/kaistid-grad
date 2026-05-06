import { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { StampDocument } from '../../types/stamp';
import { ArtistData } from '../../types/artist';
import { colors, fonts, breakpoints, motion } from '../../styles/tokens';
import { generateCompletionCard, downloadBlob } from '../../utils/generateCertificate';
import { useUIStore } from '../../store/uiStore';
import { formatArtistOrder } from '../../utils/formatters';

// ── StampProgress ──────────────────────────────────────────────
interface StampProgressProps {
  collected: number;
  total: number;
}

export function StampProgress({ collected, total }: StampProgressProps) {
  const pct = (collected / total) * 100;

  return (
    <ProgressWrap>
      <ProgressText>
        <ProgressCount>
          <span>{collected}</span> / {total}
        </ProgressCount>
        <ProgressLabel>스탬프 수집</ProgressLabel>
      </ProgressText>
      <ProgressBar>
        <ProgressFill style={{ width: `${pct}%` }} />
      </ProgressBar>
    </ProgressWrap>
  );
}

const ProgressWrap = styled.div`
  margin-bottom: 2.5rem;
`;

const ProgressText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
`;

const ProgressCount = styled.div`
  font-family: ${fonts.display};
  font-size: 42px;
  font-weight: 300;
  color: ${colors.textPrimary};

  span {
    color: ${colors.accentWarm};
  }
`;

const ProgressLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const ProgressBar = styled.div`
  height: 2px;
  background: ${colors.border};
  border-radius: 1px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${colors.accentWarm};
  border-radius: 1px;
  transition: width ${motion.slow};
`;

// ── StampCell ──────────────────────────────────────────────
const stampIn = keyframes`
  0% { transform: scale(0) rotate(-20deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

interface StampCellProps {
  artist: ArtistData;
  isCollected: boolean;
  isNew: boolean;
  onClick: () => void;
}

export function StampCell({ artist, isCollected, isNew, onClick }: StampCellProps) {
  return (
    <Cell $collected={isCollected} onClick={onClick}>
      <CellCircle $collected={isCollected} $new={isNew}>
        {isCollected ? (
          <CellCheck>✓</CellCheck>
        ) : (
          <CellNum>{formatArtistOrder(artist.order)}</CellNum>
        )}
      </CellCircle>
      <CellName>{artist.name.ko}</CellName>
      {isCollected && (
        <CellWork>{artist.work.titleKo}</CellWork>
      )}
    </Cell>
  );
}

const Cell = styled.div<{ $collected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 1rem 0.5rem;
  cursor: pointer;
  border: 1px solid ${({ $collected }) => $collected ? 'rgba(200,168,130,0.3)' : colors.border};
  border-radius: 4px;
  background: ${({ $collected }) => $collected ? 'rgba(200,168,130,0.05)' : 'transparent'};
  transition: all ${motion.base};

  &:hover {
    border-color: ${colors.borderHover};
    background: ${colors.surfaceHover};
  }
`;

const CellCircle = styled.div<{ $collected: boolean; $new: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  animation: ${({ $new }) => $new ? stampIn : 'none'} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;

  ${({ $collected }) => $collected ? `
    background: rgba(200, 168, 130, 0.15);
    border-color: rgba(200, 168, 130, 0.5);
  ` : `
    background: transparent;
    border-color: ${colors.border};
  `}
`;

const CellCheck = styled.span`
  font-size: 18px;
  color: ${colors.accentWarm};
`;

const CellNum = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.textTertiary};
`;

const CellName = styled.span`
  font-family: ${fonts.body};
  font-size: 12px;
  color: ${colors.textSecondary};
  text-align: center;
`;

const CellWork = styled.span`
  font-family: ${fonts.mono};
  font-size: 9px;
  letter-spacing: 0.08em;
  color: ${colors.textTertiary};
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ── StampGrid ──────────────────────────────────────────────
interface StampGridProps {
  artists: ArtistData[];
  stampsDoc: StampDocument | null;
  newCode: string | null;
  onCellClick: (artist: ArtistData) => void;
}

export function StampGrid({ artists, stampsDoc, newCode, onCellClick }: StampGridProps) {
  const collected = stampsDoc?.collectedCodes ?? [];

  return (
    <Grid>
      {artists.map(artist => (
        <StampCell
          key={artist.id}
          artist={artist}
          isCollected={collected.includes(artist.qrCode.code)}
          isNew={artist.qrCode.code === newCode}
          onClick={() => onCellClick(artist)}
        />
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// ── CompletionCard ──────────────────────────────────────────────
interface CompletionCardProps {
  completedAt: string;
  onDismiss: () => void;
}

export function CompletionCard({ completedAt, onDismiss }: CompletionCardProps) {
  const { addToast } = useUIStore();

  const handleDownload = async () => {
    try {
      const blob = await generateCompletionCard(completedAt);
      downloadBlob(blob, 'KAIST-ID-2026-Complete.png');
      addToast('기념 카드가 다운로드되었습니다.', 'success');
    } catch {
      addToast('다운로드에 실패했습니다.', 'error');
    }
  };

  return (
    <CompletionWrap>
      <CompletionContent>
        <CompletionIcon>✦</CompletionIcon>
        <CompletionTitle>완주를 축하합니다</CompletionTitle>
        <CompletionSub>
          14개 작품 모두 방문하셨습니다.<br />
          디지털 기념 카드를 저장해보세요.
        </CompletionSub>
        <CompletionBtns>
          <DownloadBtn onClick={handleDownload}>
            기념 카드 저장 ↓
          </DownloadBtn>
          <DismissBtn onClick={onDismiss}>닫기</DismissBtn>
        </CompletionBtns>
      </CompletionContent>
    </CompletionWrap>
  );
}

const CompletionWrap = styled.div`
  background: linear-gradient(135deg, ${colors.surface} 0%, rgba(200,168,130,0.1) 100%);
  border: 1px solid rgba(200,168,130,0.3);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInUp 0.5s ease both;
`;

const CompletionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CompletionIcon = styled.div`
  font-size: 2.5rem;
  color: ${colors.accentWarm};
  animation: pulse 2s infinite;
`;

const CompletionTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: 36px;
  font-weight: 300;
  color: ${colors.textPrimary};
`;

const CompletionSub = styled.p`
  font-size: 15px;
  color: ${colors.textSecondary};
  line-height: 1.7;
`;

const CompletionBtns = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const DownloadBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 12px 24px;
  background: ${colors.accentWarm};
  color: ${colors.black};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background ${motion.fast};

  &:hover { background: ${colors.accentWarmHover}; }
`;

const DismissBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 12px 24px;
  background: transparent;
  color: ${colors.textSecondary};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  cursor: pointer;
  transition: all ${motion.fast};

  &:hover { border-color: ${colors.borderHover}; }
`;

// ── QRScanner (Web-based) ──────────────────────────────────────────────
interface QRScannerProps {
  onScan: (code: string) => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let scanner: any = null;

    async function initScanner() {
      if (!containerRef.current) return;

      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        scanner = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scanner.render(
          (decodedText: string) => {
            try {
              const url = new URL(decodedText);
              const code = url.searchParams.get('code');
              if (code) {
                onScan(code);
                scanner?.clear();
              } else {
                // Try direct code
                onScan(decodedText);
                scanner?.clear();
              }
            } catch {
              onScan(decodedText);
              scanner?.clear();
            }
          },
          (errorMsg: string) => {
            if (onError) onError(errorMsg);
          }
        );

        scannerRef.current = scanner;
      } catch (e) {
        console.warn('QR Scanner not available:', e);
        if (onError) onError('카메라를 사용할 수 없습니다.');
      }
    }

    initScanner();

    return () => {
      try {
        scanner?.clear();
      } catch {}
    };
  }, [onScan, onError]);

  return (
    <ScannerWrap>
      <div id="qr-reader" ref={containerRef} />
      <ScannerHint>
        스마트폰 카메라를 QR 코드에 가져다 대세요
      </ScannerHint>
    </ScannerWrap>
  );
}

const ScannerWrap = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;

  #qr-reader {
    border: 1px solid ${colors.border} !important;
    border-radius: 4px !important;
    background: ${colors.surface} !important;
  }

  #qr-reader video {
    border-radius: 4px !important;
  }
`;

const ScannerHint = styled.p`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
  text-align: center;
  margin-top: 1rem;
`;
