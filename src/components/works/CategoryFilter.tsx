import styled from 'styled-components';
import { ArtworkCategory, CATEGORY_LABELS } from '../../types/artist';
import { colors, fonts, motion } from '../../styles/tokens';

interface CategoryFilterProps {
  selected: ArtworkCategory | 'all';
  onChange: (cat: ArtworkCategory | 'all') => void;
}

const ALL_CATEGORIES: Array<{ value: ArtworkCategory | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value: value as ArtworkCategory,
    label,
  })),
];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <FilterBar>
      {ALL_CATEGORIES.map(cat => (
        <FilterBtn
          key={cat.value}
          $active={selected === cat.value}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </FilterBtn>
      ))}
    </FilterBar>
  );
}

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid;
  cursor: pointer;
  transition: all ${motion.fast};

  ${({ $active }) => $active ? `
    background: rgba(200, 168, 130, 0.15);
    border-color: rgba(200, 168, 130, 0.5);
    color: ${colors.accentWarm};
  ` : `
    background: transparent;
    border-color: ${colors.border};
    color: ${colors.textTertiary};

    &:hover {
      border-color: ${colors.borderHover};
      color: ${colors.textSecondary};
    }
  `}
`;
