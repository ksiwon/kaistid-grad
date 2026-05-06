import React, { useState } from 'react';
import styled from 'styled-components';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { ToastProvider } from '../components/common';
import WorkCard from '../components/works/WorkCard';
import { useArtists } from '../hooks/useArtists';
import { ZONE_CONFIGS, ZONE_ORDER, ZoneId } from '../types/zone';
import { colors, fonts, spacing } from '../styles/tokens';

// ── Styled ─────────────────────────────────────────────────────
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

const FilterSection = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xl} 2.5rem 0;

  @media (max-width: 768px) {
    padding: ${spacing.lg} 1.5rem 0;
  }
`;

const FilterLabel = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.14em;
  color: ${colors.textTertiary};
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterBtn = styled.button<{ $active: boolean; $color?: string }>`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.18s;

  ${({ $active, $color }) =>
    $active
      ? `
    background: ${$color ? `${$color}20` : 'rgba(200,168,130,0.15)'};
    border-color: ${$color ?? 'rgba(200,168,130,0.5)'};
    color: ${$color ?? '#c8a882'};
  `
      : `
    background: transparent;
    border-color: ${colors.border};
    color: ${colors.textTertiary};
    &:hover { border-color: ${colors.borderHover}; color: ${colors.textSecondary}; }
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: ${colors.border};
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xl} 2.5rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { padding: ${spacing.lg} 1.5rem; }
  @media (max-width: 600px) { grid-template-columns: 1fr; padding: ${spacing.md} 1.5rem; }
`;

const EmptyMsg = styled.div`
  text-align: center;
  padding: ${spacing.xxl} ${spacing.xl};
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 13px;
  grid-column: 1 / -1;
`;

// ── Component ─────────────────────────────────────────────────
type FilterValue = 'all' | ZoneId;

const WorksPage: React.FC = () => {
  const { data: artists = [], isLoading } = useArtists();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const filtered =
    activeFilter === 'all'
      ? artists
      : artists.filter((a) => a.zone === activeFilter);

  return (
    <ToastProvider>
      <Nav />
      <PageWrap>
        <PageHeader>
          <PageHeaderInner>
            <Title>Works</Title>
            <Sub>2026 KAIST ID · {artists.length}명의 졸업 작품</Sub>
          </PageHeaderInner>
        </PageHeader>

        <FilterSection>
          <FilterLabel>Zone</FilterLabel>
          <FilterBar>
            <FilterBtn
              $active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              전체
            </FilterBtn>
            {ZONE_ORDER.map((id) => {
              const cfg = ZONE_CONFIGS[id];
              return (
                <FilterBtn
                  key={id}
                  $active={activeFilter === id}
                  $color={cfg.color}
                  onClick={() => setActiveFilter(id)}
                >
                  {cfg.emoji} {cfg.labelKo}
                </FilterBtn>
              );
            })}
          </FilterBar>
        </FilterSection>

        <Grid>
          {isLoading ? (
            <EmptyMsg>작품을 불러오는 중…</EmptyMsg>
          ) : filtered.length === 0 ? (
            <EmptyMsg>해당 Zone에 작품이 없습니다</EmptyMsg>
          ) : (
            filtered.map((artist, i) => (
              <WorkCard key={artist.id} artist={artist} index={i} />
            ))
          )}
        </Grid>
      </PageWrap>
      <Footer />
    </ToastProvider>
  );
};

export default WorksPage;