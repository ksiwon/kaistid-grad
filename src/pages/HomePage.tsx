import React from 'react';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { HeroSection, FeaturedWorks, AboutTeaser, QATeaser } from '../components/home';
import { ToastProvider } from '../components/common';
import { useArtists } from '../hooks/useArtists';
import { useQuestions } from '../hooks/useQuestions';

const HomePage: React.FC = () => {
  const { data: artists = [] } = useArtists();
  const { questions = [] } = useQuestions();

  return (
    <ToastProvider>
      <Nav />
      <main>
        <HeroSection />
        <FeaturedWorks artists={artists} />
        <AboutTeaser />
        <QATeaser questions={questions} />
      </main>
      <Footer />
    </ToastProvider>
  );
};

export default HomePage;
