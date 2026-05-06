import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, fonts, breakpoints } from '../../styles/tokens';

export default function Footer() {
  return (
    <FooterEl>
      <FooterInner>
        <FooterLeft>
          <FooterLogo>
            <span>K</span>
            KAIST ID 2026
          </FooterLogo>
          <FooterDesc>
            2026 KAIST 산업디자인학과<br />
            학부 졸업전시
          </FooterDesc>
        </FooterLeft>

        <FooterCenter>
          <FooterInfoGroup>
            <FooterInfoLabel>전시 기간</FooterInfoLabel>
            <FooterInfoValue>2026.12.02 – 12.12</FooterInfoValue>
          </FooterInfoGroup>
          <FooterInfoGroup>
            <FooterInfoLabel>관람 시간</FooterInfoLabel>
            <FooterInfoValue>10:00 – 18:00 (일·월 휴관)</FooterInfoValue>
          </FooterInfoGroup>
          <FooterInfoGroup>
            <FooterInfoLabel>장소</FooterInfoLabel>
            <FooterInfoValue>세지화랑 · 서울 종로구 북촌로4길 27, B1</FooterInfoValue>
          </FooterInfoGroup>
          <FooterInfoGroup>
            <FooterInfoLabel>입장</FooterInfoLabel>
            <FooterInfoValue>무료 · Walk-in</FooterInfoValue>
          </FooterInfoGroup>
        </FooterCenter>

        <FooterRight>
          <FooterNavGroup>
            <FooterNavLabel>Navigate</FooterNavLabel>
            <FooterNavLink to="/works">Works</FooterNavLink>
            <FooterNavLink to="/qa">Q&A</FooterNavLink>
            <FooterNavLink to="/stamp">Stamp Rally</FooterNavLink>
            <FooterNavLink to="/about">About</FooterNavLink>
          </FooterNavGroup>
        </FooterRight>
      </FooterInner>

      <FooterBottom>
        <FooterCopy>
          © 2026 KAIST Industrial Design. All works belong to respective artists.
        </FooterCopy>
        <FooterMeta>
          KAIST 산업디자인학과 졸업전시위원회
        </FooterMeta>
      </FooterBottom>
    </FooterEl>
  );
}

const FooterEl = styled.footer`
  border-top: 1px solid ${colors.border};
  background: ${colors.surface};
`;

const FooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2.5rem;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 3rem;

  @media (max-width: ${breakpoints.desktop}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    padding: 3rem 1.5rem;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textSecondary};

  span {
    width: 28px;
    height: 28px;
    border: 1px solid ${colors.accentWarm};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${fonts.display};
    font-size: 16px;
    color: ${colors.accentWarm};
    font-weight: 300;
  }
`;

const FooterDesc = styled.p`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.06em;
  color: ${colors.textTertiary};
  line-height: 1.8;
`;

const FooterCenter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FooterInfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FooterInfoLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

const FooterInfoValue = styled.span`
  font-size: 13px;
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

const FooterRight = styled.div``;

const FooterNavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterNavLabel = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  margin-bottom: 4px;
`;

const FooterNavLink = styled(Link)`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.1em;
  color: ${colors.textSecondary};
  transition: color 0.2s;

  &:hover {
    color: ${colors.accentWarm};
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${colors.border};
  padding: 1.25rem 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    padding: 1.25rem 1.5rem;
  }
`;

const FooterCopy = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
`;

const FooterMeta = styled.p`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.textTertiary};
`;
