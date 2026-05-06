import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import SuperDashboard from '../components/admin/SuperDashboard';
import { useAuth } from '../hooks/useAuth';
import { useArtists } from '../hooks/useArtists';
import { updateArtist } from '../services/artistService';
import { colors, fonts } from '../styles/tokens';
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

const SuperAdminPage: React.FC = () => {
  const { user, isSuperAdmin, isLoading: authLoading } = useAuth();
  const { data: artists = [], isLoading, refetch } = useArtists();

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <Loading>불러오는 중...</Loading>
      </AdminLayout>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
  if (!isSuperAdmin) return <Navigate to="/" replace />;

  const handleTogglePublish = async (artistId: string, isPublished: boolean) => {
    await updateArtist(artistId, { meta: { isPublished } as any });
    await refetch();
  };

  return (
    <AdminLayout title="Super Admin">
      <SuperDashboard
        artists={artists}
        onTogglePublish={handleTogglePublish}
      />
    </AdminLayout>
  );
};

export default SuperAdminPage;
