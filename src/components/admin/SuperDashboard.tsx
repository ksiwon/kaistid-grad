import React, { useState } from 'react';
import styled from 'styled-components';
import { ArtistData } from '../../types/artist';
import { colors, fonts, spacing, radius } from '../../styles/tokens';
import { generateQRCodeDataURL, downloadQRCode } from '../../utils/qrCodeHelper';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.xl};
  margin-bottom: ${spacing.xxl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing.xl};
`;

const CardTitle = styled.h3`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.xl};
`;

const StatNum = styled.p`
  font-family: ${fonts.display};
  font-size: 48px;
  font-weight: 300;
  color: ${colors.textPrimary};
  line-height: 1;
  margin-bottom: ${spacing.sm};
`;

const StatLabel = styled.p`
  font-family: ${fonts.mono};
  font-size: 11px;
  color: ${colors.textSecondary};
  letter-spacing: 0.1em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  text-align: left;
  padding: ${spacing.sm} ${spacing.md};
  border-bottom: 1px solid ${colors.border};
`;

const Td = styled.td`
  padding: ${spacing.md};
  font-size: 13px;
  color: ${colors.textPrimary};
  border-bottom: 1px solid ${colors.border};
  vertical-align: middle;
`;

const Toggle = styled.button<{ $active: boolean }>`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: ${radius.pill};
  border: 1px solid ${(p) => (p.$active ? colors.success : colors.border)};
  background: ${(p) => (p.$active ? 'rgba(74,157,111,0.12)' : 'transparent')};
  color: ${(p) => (p.$active ? colors.success : colors.textTertiary)};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const QRBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: transparent;
  color: ${colors.accentWarm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(200, 168, 130, 0.1);
  }
`;

const FullBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: ${spacing.md} ${spacing.xl};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background: transparent;
  color: ${colors.textPrimary};
  cursor: pointer;
  margin-top: ${spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.accentWarm};
    color: ${colors.accentWarm};
  }
`;

interface SuperDashboardProps {
  artists: ArtistData[];
  stampStats?: { total: number; completed: number; scansPerArtist: Record<string, number> };
  onTogglePublish: (artistId: string, isPublished: boolean) => Promise<void>;
}

const SuperDashboard: React.FC<SuperDashboardProps> = ({
  artists,
  stampStats = { total: 0, completed: 0, scansPerArtist: {} },
  onTogglePublish,
}) => {
  const [toggling, setToggling] = useState<string | null>(null);

  const published = artists.filter((a) => a.meta.isPublished).length;

  const handleToggle = async (artist: ArtistData) => {
    setToggling(artist.id);
    try {
      await onTogglePublish(artist.id, !artist.meta.isPublished);
    } finally {
      setToggling(null);
    }
  };

  const handleDownloadQR = async (artist: ArtistData) => {
    const dataUrl = await generateQRCodeDataURL(artist.qrCode.code);
    downloadQRCode(dataUrl, `QR_${artist.qrCode.code}`);
  };

  const handleDownloadAllQR = async () => {
    for (const artist of artists) {
      const dataUrl = await generateQRCodeDataURL(artist.qrCode.code);
      downloadQRCode(dataUrl, `QR_${artist.qrCode.code}`);
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  return (
    <>
      <Grid>
        <Card>
          <CardTitle>전시 현황</CardTitle>
          <StatNum>{published}<span style={{ fontSize: 24, color: colors.textTertiary }}> / {artists.length}</span></StatNum>
          <StatLabel>작품 공개 중</StatLabel>
        </Card>
        <Card>
          <CardTitle>스탬프 랠리</CardTitle>
          <StatNum>{stampStats.total}</StatNum>
          <StatLabel>총 방문 세션 · 완주 {stampStats.completed}명</StatLabel>
        </Card>
      </Grid>

      <Card>
        <CardTitle>작가 관리</CardTitle>
        <Table>
          <thead>
            <tr>
              <Th>No.</Th>
              <Th>작가명</Th>
              <Th>QR 코드</Th>
              <Th>스캔 수</Th>
              <Th>공개 상태</Th>
              <Th>QR 다운로드</Th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id}>
                <Td style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textTertiary }}>
                  {String(artist.order).padStart(2, '0')}
                </Td>
                <Td>{artist.name.ko}</Td>
                <Td style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textTertiary }}>
                  {artist.qrCode.code}
                </Td>
                <Td style={{ fontFamily: fonts.mono }}>
                  {stampStats.scansPerArtist[artist.id] ?? 0}
                </Td>
                <Td>
                  <Toggle
                    $active={artist.meta.isPublished}
                    onClick={() => handleToggle(artist)}
                    disabled={toggling === artist.id}
                  >
                    {artist.meta.isPublished ? '공개' : '비공개'}
                  </Toggle>
                </Td>
                <Td>
                  <QRBtn onClick={() => handleDownloadQR(artist)}>PNG ↓</QRBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <FullBtn onClick={handleDownloadAllQR}>QR 코드 전체 다운로드 (14개)</FullBtn>
      </Card>
    </>
  );
};

export default SuperDashboard;
