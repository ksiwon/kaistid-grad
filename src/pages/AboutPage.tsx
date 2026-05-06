import React from 'react';
import styled from 'styled-components';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { ToastProvider } from '../components/common';
import { colors, fonts, spacing, radius } from '../styles/tokens';

const PageWrap = styled.div`
  padding-top: 80px;
`;

/* ── Section wrappers (border spans full width; inner is max-width constrained) ── */
const SectionWrap = styled.section`
  border-bottom: 1px solid ${colors.border};
`;

const SectionInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xxl} 2.5rem;

  @media (max-width: 768px) {
    padding: ${spacing.xl} 1.5rem;
  }
`;

const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xxl} 2.5rem;

  @media (max-width: 768px) {
    padding: ${spacing.xl} 1.5rem;
  }
`;

const Title = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 300;
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.xl};
`;

const Desc = styled.p`
  font-size: 16px;
  line-height: 1.9;
  color: ${colors.textSecondary};
  max-width: 620px;

  & + & {
    margin-top: ${spacing.lg};
  }
`;

const SectionLabel = styled.p`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.xl};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.xl};

  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  border-top: 1px solid ${colors.border};
  padding-top: ${spacing.lg};
`;

const InfoKey = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  margin-bottom: ${spacing.sm};
`;

const InfoVal = styled.p`
  font-size: 15px;
  color: ${colors.textPrimary};
  line-height: 1.6;
`;

const MapSection = styled.section`
  border-bottom: 1px solid ${colors.border};
`;

const DirectionsSection = styled.section``;

const MapEmbed = styled.div`
  width: 100%;
  max-width: 800px;
  height: 420px;
  background: ${colors.surfaceAlt};
  border-radius: ${radius.lg};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colors.border};
  margin-top: ${spacing.xl};

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const MapPlaceholder = styled.div`
  text-align: center;
`;

const MapLabel = styled.p`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  color: ${colors.textTertiary};
  margin-bottom: ${spacing.md};
`;

const MapLink = styled.a`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${colors.accentWarm};
  text-decoration: none;
  border-bottom: 1px solid ${colors.accentWarm};
  padding-bottom: 2px;
`;

const DirectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${spacing.xl};
  margin-top: ${spacing.xl};
`;

const DirectionCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing.xl};
`;

const TransitType = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.md};
`;

const DirectionText = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.7;
`;

const AboutPage: React.FC = () => {
  return (
    <ToastProvider>
      <Nav />
      <PageWrap>
        {/* Hero */}
        <SectionWrap>
          <HeroInner>
            <Title>About</Title>
            <Desc>
              2026 KAIST ID 졸업전시는 KAIST 산업디자인학과 학부 졸업생 14명의 작품을 소개하는 전시입니다.
              각자의 탐구와 질문으로 완성된 작품들은 디자인의 가능성과 경계를 새롭게 탐색합니다.
            </Desc>
            <Desc>
              오프라인 전시 세지화랑과 온라인 플랫폼이 동등한 비중으로 공존합니다. 현장을 방문하지 못하더라도
              이 웹사이트를 통해 전시를 완전히 경험하실 수 있습니다.
            </Desc>
          </HeroInner>
        </SectionWrap>

        {/* Info Section */}
        <SectionWrap>
          <SectionInner>
            <SectionLabel>전시 정보</SectionLabel>
            <InfoGrid>
            <InfoItem>
              <InfoKey>전시명</InfoKey>
              <InfoVal>2026 KAIST ID 졸업전시</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>기간</InfoKey>
              <InfoVal>2026.12.02(수) – 12.12(토)</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>관람 시간</InfoKey>
              <InfoVal>오전 10:00 – 오후 6:00<br />일·월요일 휴관</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>장소</InfoKey>
              <InfoVal>세지화랑<br />서울시 종로구 북촌로4길 27, B1</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>입장</InfoKey>
              <InfoVal>무료 · Walk-in</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>참여 인원</InfoKey>
              <InfoVal>14명 (학부 졸업생)</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>주최</InfoKey>
              <InfoVal>KAIST 산업디자인학과<br />졸업전시위원회</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>문의</InfoKey>
              <InfoVal>id.gradshow.2026<br />@gmail.com</InfoVal>
            </InfoItem>
            <InfoItem>
              <InfoKey>온라인 아카이브</InfoKey>
              <InfoVal>전시 종료 후에도<br />상시 운영</InfoVal>
            </InfoItem>
            </InfoGrid>
          </SectionInner>
        </SectionWrap>

        {/* Map Section */}
        <MapSection>
          <SectionInner>
            <SectionLabel>오시는 길</SectionLabel>
            <MapEmbed>
            <iframe 
              src="https://maps.google.com/maps?q=서울%20종로구%20북촌로4길%2027&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              loading="lazy" 
              title="세지화랑 위치"
            />
            </MapEmbed>
            <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
              <MapLabel>세지화랑 · 서울시 종로구 북촌로4길 27, 지하 1층</MapLabel>
              <MapLink
                href="https://maps.app.goo.gl/2Y3SghbEowAe4Qjr7"
                target="_blank"
                rel="noopener noreferrer"
              >
                구글 지도에서 보기 →
              </MapLink>
            </div>
          </SectionInner>
        </MapSection>

        {/* Directions Section */}
        <SectionInner as="section">
          <SectionLabel>교통 안내</SectionLabel>
          <DirectionsGrid>
            <DirectionCard>
              <TransitType>🚇 지하철</TransitType>
              <DirectionText>
                3호선 안국역 2번 출구 → 도보 7분<br />
                경복궁 방향으로 직진 후 좌회전
              </DirectionText>
            </DirectionCard>
            <DirectionCard>
              <TransitType>🚌 버스</TransitType>
              <DirectionText>
                재동초등학교 정류장 하차<br />
                109, 172, 151번
              </DirectionText>
            </DirectionCard>
            <DirectionCard>
              <TransitType>🚗 자가용</TransitType>
              <DirectionText>
                세지화랑 별도 주차 공간 없음<br />
                근처 공영주차장 이용 권장
              </DirectionText>
            </DirectionCard>
          </DirectionsGrid>
        </SectionInner>
      </PageWrap>
      <Footer />
    </ToastProvider>
  );
};

export default AboutPage;
