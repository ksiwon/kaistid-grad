import { useQuery } from '@tanstack/react-query';
import { fetchAllArtists } from '../services/artistService';

export function useArtists() {
  return useQuery({
    queryKey: ['artists'],
    queryFn: fetchAllArtists,
    staleTime: 5 * 60 * 1000,
  });
}
