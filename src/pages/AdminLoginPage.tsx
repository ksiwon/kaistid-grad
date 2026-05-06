import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { isConfigured } from '../services/firebase';
import { colors, fonts, spacing, radius } from '../styles/tokens';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.black};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
  position: relative;
`;

const Logo = styled.div`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.xxl};
  animation: ${fadeIn} 0.4s ease;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing.xxl};
  animation: ${fadeIn} 0.4s ease 0.1s both;
`;

const CardTitle = styled.h1`
  font-family: ${fonts.display};
  font-size: 28px;
  font-weight: 300;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.xs};
`;

const CardSub = styled.p`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
  margin-bottom: ${spacing.xxl};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
`;

const Label = styled.label`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

const Input = styled.input`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.accentWarm};
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: ${spacing.lg};
  background: ${colors.accentWarm};
  color: ${colors.black};
  border: none;
  border-radius: ${radius.md};
  font-family: ${fonts.mono};
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s ease;
  margin-top: ${spacing.sm};

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const ErrorMsg = styled.p`
  color: ${colors.error};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.08em;
  margin-top: ${spacing.md};
  text-align: center;
`;

const BackLink = styled.button`
  position: absolute;
  top: ${spacing.xl};
  left: ${spacing.xl};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${colors.textTertiary};
  background: none;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  animation: ${fadeIn} 0.4s ease 0.2s both;

  &:hover { color: ${colors.textSecondary}; }
`;

const DevControls = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
  animation: ${fadeIn} 0.4s ease 0.3s both;
`;

const DevBtn = styled.button`
  background: rgba(200, 168, 130, 0.1);
  border: 1px solid ${colors.accentWarm};
  color: ${colors.accentWarm};
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: ${radius.md};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(200, 168, 130, 0.2);
  }
`;

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      // redirect will be handled by useAuth / App.tsx
      navigate('/admin/' + email.split('@')[0]);
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <PageWrapper>
      <Nav />
      <MainContent>
        <BackLink onClick={() => navigate('/')}>← 전시 메인으로</BackLink>
        <Logo>2026 KAIST ID Gradshow</Logo>
      <Card>
        <CardTitle>작가 로그인</CardTitle>
        <CardSub>CMS 패널에 접속하려면 로그인하세요</CardSub>

        <Field>
          <Label>이메일</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="your.id@kaist.ac.kr"
            autoComplete="email"
          />
        </Field>
        <Field>
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>

        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? '로그인 중…' : '로그인'}
        </SubmitBtn>

        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>

      {!isConfigured && (
        <DevControls>
          <DevBtn onClick={() => navigate('/admin/super')}>관리자 (Dev)</DevBtn>
          <DevBtn onClick={() => navigate('/admin/minseo-kim')}>전시자 (Dev)</DevBtn>
        </DevControls>
      )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default AdminLoginPage;
