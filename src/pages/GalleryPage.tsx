import React, { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MOCK_ARTISTS } from '../data/mockData';
import { ZONE_CONFIGS, ZONE_ORDER, ZoneId } from '../types/zone';
import { ArtistData } from '../types/artist';
import { useZoneStore } from '../store/zoneStore';
import { InvitationModal } from '../components/invitationModal';
import { StickyBoard } from '../components/stickyBoard';
import { colors, fonts } from '../styles/tokens';
import type { GallerySceneProps } from '../components/gallery/GalleryScene';

// Lazy-load the heavy Three.js scene so it doesn't block the initial bundle
const GalleryScene = lazy<React.ComponentType<GallerySceneProps>>(() =>
  import('../components/gallery/GalleryScene').then((m) => ({ default: m.GalleryScene })),
);

// ── Layout ─────────────────────────────────────────────────────
const Page = styled.div`
  width: 100%;
  height: 100svh;           /* safe-area aware height on mobile */
  position: relative;
  overflow: hidden;
  background: #060606;
  touch-action: none;       /* prevent accidental pull-to-refresh on mobile */
`;

const SceneWrap = styled.div`
  width: 100%;
  height: 100%;
`;

const Loader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.22em;
  background: #060606;
`;

// ── HUD elements ──────────────────────────────────────────────
const TopBar = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
`;

const Logo = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.22em;
  color: ${colors.textTertiary};
`;

const ZoneHint = styled(motion.div)`
  text-align: center;
  pointer-events: none;
`;

const ZoneName = styled.p<{ $c: string }>`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.18em;
  color: ${({ $c }) => $c};
`;

const ZoneTagline = styled.p`
  font-family: ${fonts.display};
  font-size: 11px;
  font-style: italic;
  color: ${colors.textTertiary};
  margin-top: 2px;
`;

const VisitBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const VisitDot = styled.div<{ $done: boolean; $c: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $done, $c }) => ($done ? $c : 'rgba(232,228,220,0.15)')};
  transition: background 0.4s;
`;

// Back button – pointer-events: auto so it's clickable even inside the pointer-events:none TopBar
const BackBtn = styled(motion.button)`
  pointer-events: auto;
  position: absolute;
  top: 14px;
  left: 18px;
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${colors.textTertiary};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 7px 14px;
  z-index: 20;
  background: rgba(6,6,6,0.75);
  backdrop-filter: blur(6px);

  &:hover { color: ${colors.textPrimary}; border-color: ${colors.borderHover}; }
`;

const HomeButton = styled(Link)`
  pointer-events: auto;
  position: absolute;
  bottom: 24px;
  left: 24px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(6,6,6,0.75);
  backdrop-filter: blur(6px);
  border: 1px solid ${colors.border};
  color: ${colors.textTertiary};
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.textPrimary};
    border-color: ${colors.borderHover};
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    bottom: 80px; /* Above bottom nav */
    left: 16px;
    width: 40px;
    height: 40px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

// ── Bottom zone nav ───────────────────────────────────────────
const BottomNav = styled.nav`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 14px 16px max(env(safe-area-inset-bottom), 14px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(transparent, rgba(6,6,6,0.92));
  flex-wrap: wrap;
  z-index: 10;
`;

const ZoneBtn = styled(motion.button)<{ $active: boolean; $visited: boolean; $c: string }>`
  padding: 8px 16px;
  border-radius: 24px;
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  border: 1px solid ${({ $active, $c }) => ($active ? $c : 'rgba(232,228,220,0.12)')};
  background: ${({ $active, $c }) => ($active ? `${$c}1a` : 'transparent')};
  color: ${({ $active, $c, $visited }) =>
    $active ? $c : $visited ? 'rgba(232,228,220,0.55)' : 'rgba(232,228,220,0.25)'};
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 9px;
  }
`;

// ── Artwork Drawer ────────────────────────────────────────────
const Backdrop = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 50;
`;

const Drawer = styled(motion.div)`
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: min(520px, 100vw);
  background: #0e0e0e;
  border-left: 1px solid ${colors.border};
  z-index: 51;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  /* thin custom scrollbar */
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 2px; }
`;

const Hero = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  flex-shrink: 0;
  overflow: hidden;
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px; right: 12px;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: rgba(0,0,0,0.65);
  border: 1px solid ${colors.border};
  color: ${colors.textSecondary};
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 5;

  &:hover { background: rgba(30,30,30,0.9); }
`;

const ZonePill = styled.span<{ $c: string }>`
  position: absolute;
  top: 12px; left: 12px;
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.09em;
  color: ${({ $c }) => $c};
  background: rgba(0,0,0,0.65);
  border: 1px solid ${({ $c }) => $c}55;
  border-radius: 12px;
  padding: 3px 10px;
`;

const Body = styled.div`
  padding: 26px 26px 44px;
  flex: 1;
`;

const ArtistLabel = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.15em;
  color: ${colors.textTertiary};
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const WorkTitle = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(18px, 4vw, 23px);
  font-weight: 300;
  color: ${colors.textPrimary};
  line-height: 1.35;
  margin-bottom: 8px;
`;

const OneLiner = styled.p`
  font-size: 13px;
  color: ${colors.textSecondary};
  margin-bottom: 18px;
  line-height: 1.65;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 22px;
`;

const Kw = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.07em;
  color: ${colors.textTertiary};
  border: 1px solid ${colors.border};
  border-radius: 2px;
  padding: 2px 8px;
`;

const Statement = styled.p`
  font-size: 13px;
  line-height: 1.95;
  color: ${colors.textSecondary};
  white-space: pre-line;
  margin-bottom: 28px;
`;

const Divider = styled.div`
  border-top: 1px solid ${colors.border};
  padding-top: 22px;
  margin-bottom: 6px;
`;

const SectionLabel = styled.h4`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.15em;
  color: ${colors.textTertiary};
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const FullDetailBtn = styled.button`
  width: 100%;
  padding: 13px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  color: ${colors.textSecondary};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  transition: border-color 0.2s, color 0.2s;
  margin-bottom: 20px;

  &:hover {
    border-color: ${colors.accentWarm};
    color: ${colors.accentWarm};
  }
`;

// ── Component ─────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeZone, setActiveZone, visitZone, visitedZones } = useZoneStore();
  const [selectedArtist, setSelectedArtist] = useState<ArtistData | null>(null);

  // Auto-enter zone from URL param e.g. /gallery?zone=ai
  useEffect(() => {
    const zoneParam = searchParams.get('zone') as ZoneId | null;
    if (zoneParam && ZONE_ORDER.includes(zoneParam)) {
      setActiveZone(zoneParam);
      visitZone(zoneParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group artists by zone once
  const artistsByZone = useMemo(() => {
    const map: Record<ZoneId, ArtistData[]> = { ai: [], interactive: [], design: [], futures: [] };
    MOCK_ARTISTS.forEach((a) => map[a.zone].push(a));
    return map;
  }, []);

  const handleZoneSelect = (id: ZoneId) => {
    setActiveZone(id);
    visitZone(id);        // mark as visited → may unlock invitation
    setSelectedArtist(null);
  };

  const handleBackToLobby = () => {
    setActiveZone(null);
    setSelectedArtist(null);
  };

  const activeCfg = activeZone ? ZONE_CONFIGS[activeZone] : null;

  // Progress dot row
  const totalZones  = ZONE_ORDER.length;
  const visitedCount = ZONE_ORDER.filter((id) => visitedZones.has(id)).length;

  return (
    <Page>
      {/* ── 3D scene ─────────────────────────────── */}
      <SceneWrap>
        <Suspense fallback={<Loader>GALLERY LOADING…</Loader>}>
          <GalleryScene
            artistsByZone={artistsByZone}
            activeZone={activeZone}
            visitedZones={visitedZones}
            onZoneSelect={handleZoneSelect}
            onArtworkClick={setSelectedArtist}
          />
        </Suspense>
      </SceneWrap>

      {/* ── Top bar ──────────────────────────────── */}
      <TopBar>
        <Logo>KAIST ID</Logo>

        <AnimatePresence mode="wait">
          {activeCfg ? (
            <ZoneHint
              key={activeZone}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <ZoneName $c={activeCfg.color}>{activeCfg.label}</ZoneName>
              <ZoneTagline>{activeCfg.tagline}</ZoneTagline>
            </ZoneHint>
          ) : (
            <ZoneHint
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ZoneName $c={colors.textTertiary}>Online Exhibition Hall Lobby</ZoneName>
            </ZoneHint>
          )}
        </AnimatePresence>

        <VisitBar>
          {ZONE_ORDER.map((id) => (
            <VisitDot key={id} $done={visitedZones.has(id)} $c={ZONE_CONFIGS[id].color} />
          ))}
        </VisitBar>
      </TopBar>

      {/* ── Back to lobby ────────────────────────── */}
      <AnimatePresence>
        {activeZone && (
          <BackBtn
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={handleBackToLobby}
          >
            ← 로비
          </BackBtn>
        )}
      </AnimatePresence>

      {/* ── Bottom zone nav ──────────────────────── */}
      <BottomNav>
        {ZONE_ORDER.map((id) => {
          const cfg = ZONE_CONFIGS[id];
          return (
            <ZoneBtn
              key={id}
              $active={activeZone === id}
              $visited={visitedZones.has(id)}
              $c={cfg.color}
              onClick={() => handleZoneSelect(id)}
              whileTap={{ scale: 0.95 }}
            >
              {visitedZones.has(id) ? '✓ ' : ''}{cfg.emoji} {cfg.labelKo}
            </ZoneBtn>
          );
        })}
      </BottomNav>

      {/* ── Home Button ─────────────────────────── */}
      <HomeButton to="/" aria-label="Go to Home">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </HomeButton>

      {/* ── Artwork detail drawer ─────────────────── */}
      <AnimatePresence>
        {selectedArtist && (
          <>
            <Backdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArtist(null)}
            />
            <Drawer
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <Hero>
                <HeroImg
                  src={selectedArtist.media.heroUrl}
                  alt={selectedArtist.work.titleKo}
                  loading="lazy"
                />
                <CloseBtn onClick={() => setSelectedArtist(null)}>×</CloseBtn>
                <ZonePill $c={ZONE_CONFIGS[selectedArtist.zone].color}>
                  {ZONE_CONFIGS[selectedArtist.zone].emoji}{' '}
                  {ZONE_CONFIGS[selectedArtist.zone].labelKo}
                </ZonePill>
              </Hero>

              <Body>
                <ArtistLabel>
                  {selectedArtist.name.en} · {selectedArtist.name.ko}
                </ArtistLabel>
                <WorkTitle>{selectedArtist.work.titleKo}</WorkTitle>
                {selectedArtist.work.oneLineKo && (
                  <OneLiner>{selectedArtist.work.oneLineKo}</OneLiner>
                )}

                <Keywords>
                  {selectedArtist.work.keywords.map((k) => (
                    <Kw key={k}>{k}</Kw>
                  ))}
                </Keywords>

                <Statement>{selectedArtist.work.statementKo}</Statement>

                <FullDetailBtn onClick={() => navigate(`/works/${selectedArtist.id}`)}>
                  작품 상세 & QA 보기 →
                </FullDetailBtn>

                {/* FigJam-style sticky notes */}
                <Divider>
                  <SectionLabel>관람객 노트</SectionLabel>
                </Divider>
                <StickyBoard artistId={selectedArtist.id} />
              </Body>
            </Drawer>
          </>
        )}
      </AnimatePresence>

      {/* ── Invitation modal ──────────────────────── */}
      <InvitationModal />
    </Page>
  );
};

export default GalleryPage;