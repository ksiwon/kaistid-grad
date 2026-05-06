import { useQuery } from '@tanstack/react-query';
import { fetchArtistById } from '../services/artistService';

export function useArtist(id: string | undefined) {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: () => fetchArtistById(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}
