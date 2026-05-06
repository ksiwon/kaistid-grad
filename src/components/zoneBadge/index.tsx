import React from 'react';
import styled from 'styled-components';
import { ZoneId, ZONE_CONFIGS } from '../../types/zone';
import { fonts } from '../../styles/tokens';

const Badge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}18;
  border: 1px solid ${({ $color }) => $color}50;
  border-radius: 12px;
  padding: 3px 10px;
`;

interface ZoneBadgeProps {
  zoneId: ZoneId;
  className?: string;
}

export const ZoneBadge: React.FC<ZoneBadgeProps> = ({ zoneId, className }) => {
  const cfg = ZONE_CONFIGS[zoneId];
  return (
    <Badge $color={cfg.color} className={className}>
      {cfg.emoji} {cfg.label}
    </Badge>
  );
};