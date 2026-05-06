import React, { useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ProfileForm from '../components/admin/ProfileForm';
import WorkInfoForm from '../components/admin/WorkInfoForm';
import ImageUploader from '../components/admin/ImageUploader';
import QAManager from '../components/admin/QAManager';
import { useArtist } from '../hooks/useArtist';
import { useAuth } from '../hooks/useAuth';
import { useQuestions } from '../hooks/useQuestions';
import { updateArtist } from '../services/artistService';
import { answerQuestion } from '../services/questionService';
import { ArtistData } from '../types/artist';
import { colors, fonts, spacing } from '../styles/tokens';
import styled from 'styled-components';

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40vh;
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 12px;
`;

const TabRow = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: ${spacing.xxl};
  border-bottom: 1px solid ${colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: ${spacing.md} ${spacing.xl};
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? colors.accentWarm : 'transparent')};
  color: ${(p) => (p.$active ? colors.textPrimary : colors.textTertiary)};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;

  &:hover { color: ${colors.textPrimary}; }
`;

const ArtistCMSPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { data: artist, isLoading, refetch } = useArtist(artistId || '');
  const { questions } = useQuestions(artistId);
  const [activeTab, setActiveTab] = useState<'profile' | 'work' | 'media' | 'qa'>('work');

  // local media state for uploader
  const [thumbUrl, setThumbUrl] = useState('');
  const [heroUrl, setHeroUrl] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [process_, setProcess] = useState<string[]>([]);

  React.useEffect(() => {
    if (artist) {
      setThumbUrl(artist.media.thumbnailUrl);
      setHeroUrl(artist.media.heroUrl);
      setGallery(artist.media.images);
      setProcess(artist.media.processImages || []);
    }
  }, [artist]);

  if (authLoading || isLoading) {
    return (
      <AdminLayout artistId={artistId}>
        <Loading>불러오는 중...</Loading>
      </AdminLayout>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
  if (!artist) return <Navigate to="/admin" replace />;

  const handleSave = async (data: Partial<ArtistData>) => {
    await updateArtist(artist.id, data);
    await refetch();
  };

  const handleMediaSave = async () => {
    await updateArtist(artist.id, {
      media: {
        ...artist.media,
        thumbnailUrl: thumbUrl,
        heroUrl: heroUrl,
        images: gallery,
        processImages: process_,
      },
    });
    await refetch();
  };

  const handleAnswer = async (questionId: string, content: string) => {
    await answerQuestion(questionId, content, artist.id);
  };

  return (
    <AdminLayout title={`${artist.name.ko} — CMS`} artistId={artistId}>
      <TabRow>
        <Tab $active={activeTab === 'work'} onClick={() => setActiveTab('work')}>작품 정보</Tab>
        <Tab $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>프로필</Tab>
        <Tab $active={activeTab === 'media'} onClick={() => setActiveTab('media')}>미디어</Tab>
        <Tab $active={activeTab === 'qa'} onClick={() => setActiveTab('qa')}>
          Q&A {questions.length > 0 && `(${questions.length})`}
        </Tab>
      </TabRow>

      {activeTab === 'profile' && (
        <ProfileForm artist={artist} onSave={handleSave} />
      )}
      {activeTab === 'work' && (
        <WorkInfoForm artist={artist} onSave={handleSave} />
      )}
      {activeTab === 'media' && (
        <ImageUploader
          thumbnailUrl={thumbUrl}
          heroUrl={heroUrl}
          galleryImages={gallery}
          processImages={process_}
          onThumbnailChange={setThumbUrl}
          onHeroChange={setHeroUrl}
          onGalleryChange={setGallery}
          onProcessChange={setProcess}
          onSave={handleMediaSave}
        />
      )}
      {activeTab === 'qa' && (
        <QAManager
          questions={questions}
          artistId={artist.id}
          onAnswer={handleAnswer}
        />
      )}
    </AdminLayout>
  );
};

export default ArtistCMSPage;
