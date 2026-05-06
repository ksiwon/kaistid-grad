import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useZoneStore } from '../../store/zoneStore';
import { ZONE_CONFIGS, ZONE_ORDER } from '../../types/zone';
import { colors, fonts } from '../../styles/tokens';
import { generateCompletionCard, downloadBlob } from '../../utils/generateCertificate';

// ── Animations ────────────────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const floatUp = keyframes`
  0%, 100% { transform: translateY(0px);  }
  50%       { transform: translateY(-8px); }
`;

// ── Styled ────────────────────────────────────────────────────
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled(motion.div)`
  background: #0f0f0f;
  border: 1px solid rgba(200, 168, 130, 0.28);
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  padding: 52px 44px 44px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(200,168,130,0.9) 50%, transparent 100%);
    background-size: 400px 1px;
    animation: ${shimmer} 3s linear infinite;
  }

  @media (max-width: 520px) {
    padding: 36px 24px 32px;
  }
`;

const Envelope = styled.div`
  font-size: 60px;
  margin-bottom: 24px;
  display: inline-block;
  animation: ${floatUp} 3s ease-in-out infinite;
`;

const Title = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(22px, 5vw, 30px);
  font-weight: 300;
  color: ${colors.accentWarm};
  letter-spacing: 0.04em;
  margin-bottom: 12px;
`;

const Body = styled.p`
  font-family: ${fonts.body};
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.9;
  margin-bottom: 28px;
`;

const ZoneBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const ZonePill = styled.span<{ $color: string }>`
  font-size: 11px;
  font-family: ${fonts.mono};
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid ${({ $color }) => $color}55;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}12;
`;

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 32px;
`;

const CheckDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.success};
`;

const CheckLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${colors.textTertiary};
`;

const Btns = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled(motion.button)`
  padding: 14px 30px;
  background: ${colors.accentWarm};
  color: ${colors.black};
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  border-radius: 4px;
  transition: background 0.2s;
  min-width: 160px;

  &:hover:not(:disabled) { background: ${colors.accentWarmHover}; }
  &:disabled { opacity: 0.55; cursor: wait; }
`;

const SecondaryBtn = styled.button`
  padding: 14px 24px;
  background: transparent;
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: ${colors.borderHover};
    color: ${colors.textSecondary};
  }
`;

const Note = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
  margin-top: 24px;
  letter-spacing: 0.08em;
  line-height: 1.7;
`;

// ── Component ─────────────────────────────────────────────────
export const InvitationModal: React.FC = () => {
  const { invitationUnlocked, invitationDismissed, dismissInvitation } = useZoneStore();
  const [downloading, setDownloading] = useState(false);

  const visible = invitationUnlocked && !invitationDismissed;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await generateCompletionCard(new Date().toLocaleDateString('ko-KR'));
      downloadBlob(blob, 'KAISTID2026-invitation.png');
      // Keep modal open briefly so user sees the confirmation, then dismiss
      setTimeout(dismissInvitation, 800);
    } catch (err) {
      console.error('[Invitation] Download failed:', err);
      alert('다운로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) dismissInvitation(); }}
        >
          <Card
            initial={{ scale: 0.82, opacity: 0, y: 40 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{    scale: 0.9,  opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.08 }}
          >
            <Envelope>🎟</Envelope>

            <Title>초대장이 도착했습니다</Title>

            <Body>
              온라인 전시관 4개 존을 모두 탐험하셨습니다.
              <br />
              오프라인 전시의 문이 이제 열립니다.
              <br />
              <br />
              2026년 12월, KAIST 세지화랑에서 만나요.
            </Body>

            <ZoneBadges>
              {ZONE_ORDER.map((id) => {
                const cfg = ZONE_CONFIGS[id];
                return (
                  <ZonePill key={id} $color={cfg.color}>
                    {cfg.emoji} {cfg.labelKo}
                  </ZonePill>
                );
              })}
            </ZoneBadges>

            <CheckRow>
              <CheckDot />
              <CheckLabel>4 / 4 ZONES VISITED · UNLOCKED</CheckLabel>
            </CheckRow>

            <Btns>
              <PrimaryBtn
                onClick={handleDownload}
                disabled={downloading}
                whileTap={{ scale: 0.97 }}
              >
                {downloading ? '생성 중…' : '초대장 다운로드'}
              </PrimaryBtn>
              <SecondaryBtn onClick={dismissInvitation}>나중에</SecondaryBtn>
            </Btns>

            <Note>
              오프라인 입장 시 이 초대장을 제시하세요
              <br />
              KAISTID GRADUATE EXHIBITION 2026
            </Note>
          </Card>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};