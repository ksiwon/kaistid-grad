import React from 'react';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { HeroSection, ZoneGates, AboutTeaser, QATeaser } from '../components/home';
import { ToastProvider } from '../components/common';
import { useQuestions } from '../hooks/useQuestions';

const HomePage: React.FC = () => {
  const { questions = [] } = useQuestions();

  return (
    <ToastProvider>
      <Nav />
      <main>
        <HeroSection />
        <ZoneGates />
        <AboutTeaser />
        <QATeaser questions={questions} />
      </main>
      <Footer />
    </ToastProvider>
  );
};

export default HomePage;