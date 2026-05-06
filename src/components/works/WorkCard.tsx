import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArtistData } from '../../types/artist';
import { colors, fonts, motion } from '../../styles/tokens';
import { CategoryTag } from '../common/index';
import { formatArtistOrder } from '../../utils/formatters';

interface WorkCardProps {
  artist: ArtistData;
  index: number;
}

export default function WorkCard({ artist, index }: WorkCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/works/${artist.id}`)}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <ImageWrap>
        <CardImage
          src={artist.media.thumbnailUrl}
          alt={artist.work.titleKo}
          loading="lazy"
        />
        <ImageOverlay>
          <OverlayText>{artist.work.oneLineKo || artist.work.statementKo.slice(0, 60) + '...'}</OverlayText>
          <OverlayArrow>→</OverlayArrow>
        </ImageOverlay>
      </ImageWrap>
      <CardBody>
        <CardIndex>{formatArtistOrder(artist.order)}</CardIndex>
        <CardTitle>{artist.work.titleKo}</CardTitle>
        <CardArtist>{artist.name.ko} · {artist.name.en}</CardArtist>
        <CategoryTag category={artist.category} />
      </CardBody>
    </Card>
  );
}

const Card = styled.article`
  cursor: pointer;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  overflow: hidden;
  transition: border-color ${motion.base}, transform ${motion.slow};
  animation: fadeInUp 0.5s ease both;

  &:hover {
    border-color: ${colors.borderHover};
    transform: translateY(-4px);
  }
`;

const ImageWrap = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${motion.slow};

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity ${motion.base};

  ${Card}:hover & {
    opacity: 1;
  }
`;

const OverlayText = styled.p`
  font-size: 12px;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 8px;
`;

const OverlayArrow = styled.span`
  font-family: ${fonts.mono};
  font-size: 14px;
  color: ${colors.accentWarm};
`;

const CardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardIndex = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.2em;
  color: ${colors.textTertiary};
`;

const CardTitle = styled.h3`
  font-family: ${fonts.display};
  font-size: 18px;
  font-weight: 300;
  color: ${colors.textPrimary};
  line-height: 1.3;
  margin-top: 2px;
`;

const CardArtist = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${colors.textSecondary};
  margin-bottom: 6px;
`;
