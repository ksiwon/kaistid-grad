import { css } from 'styled-components';
import { breakpoints, colors, fonts, fontSizes } from './tokens';

export const respondTo = {
  mobile: (styles: ReturnType<typeof css>) => css`
    @media (max-width: ${breakpoints.mobile}) {
      ${styles}
    }
  `,
  tablet: (styles: ReturnType<typeof css>) => css`
    @media (max-width: ${breakpoints.tablet}) {
      ${styles}
    }
  `,
  desktop: (styles: ReturnType<typeof css>) => css`
    @media (max-width: ${breakpoints.desktop}) {
      ${styles}
    }
  `,
};

export const monoLabel = css`
  font-family: ${fonts.mono};
  font-size: ${fontSizes.label};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

export const microLabel = css`
  font-family: ${fonts.mono};
  font-size: ${fontSizes.micro};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${colors.textTertiary};
`;

export const displayTitle = css`
  font-family: ${fonts.display};
  font-weight: 300;
  letter-spacing: -0.01em;
  line-height: 1.1;
`;

export const cardBase = css`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: ${colors.borderHover};
  }
`;

export const sectionPadding = css`
  padding: 5rem 2.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 2.5rem 1rem;
  }
`;

export const containerWidth = css`
  max-width: 1280px;
  margin: 0 auto;
`;
