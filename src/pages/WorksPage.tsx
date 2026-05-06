import React, { useState } from 'react';
import styled from 'styled-components';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { ToastProvider } from '../components/common';
import WorkCard from '../components/works/WorkCard';
import CategoryFilter from '../components/works/CategoryFilter';
import { useArtists } from '../hooks/useArtists';
import { ArtworkCategory } from '../types/artist';
import { colors, fonts, spacing } from '../styles/tokens';

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

const FilterWrap = styled.div`
  padding: ${spacing.xl} 2.5rem 0;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: ${spacing.lg} 1.5rem 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: ${colors.border};
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xl} 2.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    padding: ${spacing.lg} 1.5rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: ${spacing.md} 1.5rem;
  }
`;

const EmptyMsg = styled.div`
  text-align: center;
  padding: ${spacing.xxl} ${spacing.xl};
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 13px;
  grid-column: 1 / -1;
`;

const WorksPage: React.FC = () => {
  const { data: artists = [], isLoading } = useArtists();
  const [activeCategory, setActiveCategory] = useState<ArtworkCategory | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? artists
    : artists.filter((a) => a.category === activeCategory);

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

        <FilterWrap>
          <CategoryFilter selected={activeCategory} onChange={setActiveCategory} />
        </FilterWrap>

        <Grid>
          {isLoading ? (
            <EmptyMsg>작품을 불러오는 중...</EmptyMsg>
          ) : filtered.length === 0 ? (
            <EmptyMsg>해당 카테고리에 작품이 없습니다</EmptyMsg>
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
