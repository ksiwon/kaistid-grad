import styled, { keyframes } from 'styled-components';
import { colors, fonts, radius } from '../../styles/tokens';
import { ArtworkCategory, CATEGORY_LABELS } from '../../types/artist';

// ── Ticker ──────────────────────────────────────────────
const tickerAnim = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const TickerTrack = styled.div`
  overflow: hidden;
  border-top: 1px solid ${colors.border};
  border-bottom: 1px solid ${colors.border};
  padding: 12px 0;
  background: ${colors.surface};
`;

const TickerInner = styled.div<{ $duration?: number }>`
  display: flex;
  width: max-content;
  animation: ${tickerAnim} ${({ $duration }) => $duration ?? 30}s linear infinite;
`;

const TickerItem = styled.span`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
  padding: 0 2rem;
  white-space: nowrap;

  &::after {
    content: '·';
    margin-left: 2rem;
    color: ${colors.accentWarm};
  }
`;

interface TickerProps {
  items: string[];
  duration?: number;
}

export function Ticker({ items, duration = 40 }: TickerProps) {
  const doubled = [...items, ...items];
  return (
    <TickerTrack>
      <TickerInner $duration={duration}>
        {doubled.map((item, i) => (
          <TickerItem key={i}>{item}</TickerItem>
        ))}
      </TickerInner>
    </TickerTrack>
  );
}

// ── Label ──────────────────────────────────────────────
const LabelEl = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export function Label({ children, className }: LabelProps) {
  return <LabelEl className={className}>{children}</LabelEl>;
}

// ── Tag ──────────────────────────────────────────────
const TagEl = styled.span<{ $variant?: 'warm' | 'cool' | 'default' }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: ${radius.pill};
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
  border: 1px solid;

  ${({ $variant }) => {
    if ($variant === 'warm') return `
      border-color: rgba(200, 168, 130, 0.4);
      color: ${colors.accentWarm};
      background: rgba(200, 168, 130, 0.06);
    `;
    if ($variant === 'cool') return `
      border-color: rgba(180, 196, 210, 0.3);
      color: ${colors.accentCool};
      background: rgba(180, 196, 210, 0.05);
    `;
    return `
      border-color: ${colors.border};
      color: ${colors.textTertiary};
      background: transparent;
    `;
  }}
`;

interface TagProps {
  category: ArtworkCategory;
}

export function CategoryTag({ category }: TagProps) {
  return <TagEl $variant="cool">{CATEGORY_LABELS[category]}</TagEl>;
}

export function Tag({ children, variant }: { children: React.ReactNode; variant?: 'warm' | 'cool' | 'default' }) {
  return <TagEl $variant={variant}>{children}</TagEl>;
}

// ── Button ──────────────────────────────────────────────
const ButtonEl = styled.button<{ $variant?: 'solid' | 'outline' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border-radius: ${radius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ $variant }) => {
    if ($variant === 'solid') return `
      background: ${colors.accentWarm};
      color: ${colors.black};
      border: 1px solid ${colors.accentWarm};
      &:hover { background: ${colors.accentWarmHover}; border-color: ${colors.accentWarmHover}; }
    `;
    if ($variant === 'ghost') return `
      background: transparent;
      color: ${colors.textSecondary};
      border: none;
      padding: 10px 0;
      &:hover { color: ${colors.textPrimary}; }
    `;
    return `
      background: transparent;
      color: ${colors.textPrimary};
      border: 1px solid ${colors.border};
      &:hover { border-color: ${colors.borderHover}; color: ${colors.accentWarm}; }
    `;
  }}
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'outline', children, ...props }: ButtonProps) {
  return (
    <ButtonEl $variant={variant} {...props}>
      {children}
    </ButtonEl>
  );
}

// ── Toast ──────────────────────────────────────────────
const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
`;

const ToastEl = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  padding: 12px 20px;
  border-radius: ${radius.lg};
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.06em;
  border: 1px solid;
  animation: fadeInUp 0.25s ease both;
  white-space: nowrap;

  ${({ $type }) => {
    if ($type === 'success') return `
      background: rgba(74, 157, 111, 0.15);
      border-color: rgba(74, 157, 111, 0.4);
      color: ${colors.success};
    `;
    if ($type === 'error') return `
      background: rgba(184, 92, 92, 0.15);
      border-color: rgba(184, 92, 92, 0.4);
      color: ${colors.error};
    `;
    return `
      background: rgba(232, 228, 220, 0.06);
      border-color: ${colors.border};
      color: ${colors.textSecondary};
    `;
  }}
`;

import { useUIStore } from '../../store/uiStore';

export function ToastProvider({ children }: { children?: React.ReactNode }) {
  const { toasts } = useUIStore();
  return (
    <>
      {children}
      <ToastContainer>
        {toasts.map(t => (
          <ToastEl key={t.id} $type={t.type}>{t.message}</ToastEl>
        ))}
      </ToastContainer>
    </>
  );
}
