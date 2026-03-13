import { bridge } from '@/lib/bridge';
import { useQuery } from '@tanstack/react-query';

export function usePlatform() {
  return useQuery({
    queryKey: ['platform'],
    queryFn: bridge.getPlatform,
    staleTime: Infinity,
  });
}
