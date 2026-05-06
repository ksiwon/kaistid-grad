import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { colors, fonts, motion, breakpoints } from '../../styles/tokens';
import { useUIStore } from '../../store/uiStore';

const navItems = [
  { label: 'Works', path: '/works' },
  { label: 'Q&A', path: '/qa' },
  { label: 'Stamp', path: '/stamp' },
  { label: 'About', path: '/about' },
];

export default function Nav() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, setMobileNavOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  return (
    <>
      <NavBar $scrolled={scrolled}>
        <NavInner>
          <LogoLink to="/">
            <LogoMark>K</LogoMark>
            <LogoText>KAIST ID <span>2026</span></LogoText>
          </LogoLink>

          <NavLinks>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={location.pathname.startsWith(item.path)}
              >
                {item.label}
              </NavLink>
            ))}
            <AdminLink to="/admin">Admin</AdminLink>
          </NavLinks>

          <Hamburger
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            $open={mobileNavOpen}
            aria-label="메뉴 열기"
          >
            <span /><span /><span />
          </Hamburger>
        </NavInner>
      </NavBar>

      <MobileOverlay $open={mobileNavOpen}>
        <MobileLinks>
          {navItems.map((item, i) => (
            <MobileLink
              key={item.path}
              to={item.path}
              $active={location.pathname.startsWith(item.path)}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {item.label}
            </MobileLink>
          ))}
          <MobileLink to="/admin" style={{ animationDelay: '0.28s' }}>Admin</MobileLink>
        </MobileLinks>
        <MobileFooter>KAIST ID Gradshow 2026 · Seoul</MobileFooter>
      </MobileOverlay>
    </>
  );
}

const NavBar = styled.nav<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background ${motion.base}, backdrop-filter ${motion.base};
  ${({ $scrolled }) => $scrolled ? css`
    background: rgba(10, 10, 10, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid ${colors.border};
  ` : css`
    background: transparent;
  `}
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 64px;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 0 1.5rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;

const LogoMark = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid ${colors.accentWarm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${fonts.display};
  font-size: 18px;
  color: ${colors.accentWarm};
  font-weight: 300;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textSecondary};

  span {
    color: ${colors.accentWarm};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ $active }) => $active ? colors.textPrimary : colors.textSecondary};
  transition: color ${motion.fast};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 1px;
    background: ${colors.accentWarm};
    transform: scaleX(${({ $active }) => $active ? 1 : 0});
    transition: transform ${motion.base};
  }

  &:hover {
    color: ${colors.textPrimary};
    &::after { transform: scaleX(1); }
  }
`;

const AdminLink = styled(Link)`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  border: 1px solid ${colors.border};
  padding: 4px 10px;
  border-radius: 2px;
  transition: all ${motion.fast};

  &:hover {
    color: ${colors.accentWarm};
    border-color: ${colors.accentWarm};
  }
`;

const Hamburger = styled.button<{ $open: boolean }>`
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
  }

  span {
    display: block;
    width: 22px;
    height: 1px;
    background: ${colors.textPrimary};
    transition: all ${motion.base};

    &:nth-child(1) {
      transform: ${({ $open }) => $open ? 'translateY(6px) rotate(45deg)' : 'none'};
    }
    &:nth-child(2) {
      opacity: ${({ $open }) => $open ? 0 : 1};
    }
    &:nth-child(3) {
      transform: ${({ $open }) => $open ? 'translateY(-6px) rotate(-45deg)' : 'none'};
    }
  }
`;

const MobileOverlay = styled.div<{ $open: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  z-index: 99;
  background: ${colors.black};
  flex-direction: column;
  justify-content: center;
  padding: 5rem 1.5rem 2rem;
  pointer-events: ${({ $open }) => $open ? 'all' : 'none'};
  opacity: ${({ $open }) => $open ? 1 : 0};
  transition: opacity ${motion.base};

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileLink = styled(Link)<{ $active?: boolean }>`
  font-family: ${fonts.display};
  font-size: clamp(36px, 10vw, 56px);
  font-weight: 300;
  color: ${({ $active }) => $active ? colors.accentWarm : colors.textPrimary};
  text-decoration: none;
  animation: fadeInUp 0.4s ease both;
  border-bottom: 1px solid ${colors.border};
  padding: 0.75rem 0;

  &:hover {
    color: ${colors.accentWarm};
  }
`;

const MobileFooter = styled.p`
  position: absolute;
  bottom: 2rem;
  left: 1.5rem;
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.16em;
  color: ${colors.textTertiary};
  text-transform: uppercase;
`;
