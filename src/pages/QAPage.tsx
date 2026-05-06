import React from 'react';
import styled from 'styled-components';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { ToastProvider } from '../components/common';
import { QuestionForm, QuestionFeed, QAStats } from '../components/qa';
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

  @media (max-width: 860px) {
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

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 0;
  max-width: 1280px;
  margin: 0 auto;
  min-height: 60vh;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  border-right: 1px solid ${colors.border};
  padding: 2.5rem;
  position: sticky;
  top: 72px;
  height: fit-content;

  @media (max-width: 860px) {
    position: static;
    border-right: none;
    border-bottom: 1px solid ${colors.border};
    padding: 1.5rem;
  }
`;

const RightPanel = styled.div`
  padding: 2.5rem;

  @media (max-width: 860px) {
    padding: 1.5rem;
  }
`;

import { useQuestions } from '../hooks/useQuestions';
import { useArtists } from '../hooks/useArtists';

const QAPage: React.FC = () => {
  const { questions = [] } = useQuestions();
  const { data: artists = [] } = useArtists();
  const [selectedArtistId, setSelectedArtistId] = React.useState('');

  return (
    <ToastProvider>
      <Nav />
      <PageWrap>
        <PageHeader>
          <PageHeaderInner>
            <Title>Q&amp;A</Title>
            <Sub>작가에게 질문하세요</Sub>
          </PageHeaderInner>
        </PageHeader>

        <TwoCol>
          <LeftPanel>
            <QAStats questions={questions} />
            <QuestionForm 
              artists={artists} 
              selectedArtistId={selectedArtistId}
              onArtistChange={setSelectedArtistId}
              onSubmitted={() => {}} 
            />
          </LeftPanel>
          <RightPanel>
            <QuestionFeed questions={questions} filterArtistId={selectedArtistId} />
          </RightPanel>
        </TwoCol>
      </PageWrap>
      <Footer />
    </ToastProvider>
  );
};

export default QAPage;
