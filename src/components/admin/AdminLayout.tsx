import React from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { colors, fonts, spacing } from '../../styles/tokens';
import { useAuth } from '../../hooks/useAuth';

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${colors.black};
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
  padding: 0 ${spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
`;

const Logo = styled(Link)`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  text-decoration: none;
`;

const NavItems = styled.nav`
  display: flex;
  align-items: center;
  gap: ${spacing.xl};
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${(p) => (p.$active ? colors.textPrimary : colors.textSecondary)};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.textPrimary};
  }
`;

const LogoutBtn = styled.button`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.error};
  }
`;

const Content = styled.main`
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  padding: ${spacing.xxl} ${spacing.xl};

  @media (max-width: 768px) {
    padding: ${spacing.xl} ${spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-family: ${fonts.display};
  font-size: 28px;
  font-weight: 300;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.xl};
`;

interface AdminLayoutProps {
  title?: string;
  artistId?: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, artistId, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isSuperAdmin } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin');
  };

  return (
    <Wrapper>
      <Header>
        <Logo to="/">2026 KAIST ID</Logo>
        <NavItems>
          {artistId && (
            <NavLink to={`/admin/${artistId}`} $active={location.pathname.includes(artistId)}>
              내 작품 관리
            </NavLink>
          )}
          {isSuperAdmin && (
            <NavLink to="/admin/super" $active={location.pathname === '/admin/super'}>
              Super Admin
            </NavLink>
          )}
          {user && (
            <LogoutBtn onClick={handleLogout}>로그아웃</LogoutBtn>
          )}
        </NavItems>
      </Header>

      <Content>
        {title && <PageTitle>{title}</PageTitle>}
        {children}
      </Content>
    </Wrapper>
  );
};

export default AdminLayout;
