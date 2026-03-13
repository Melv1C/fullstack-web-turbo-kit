import { bridge } from '@/lib/bridge';
import { useQuery } from '@tanstack/react-query';

export function useAppName() {
  return useQuery({
    queryKey: ['appName'],
    queryFn: bridge.getAppName,
    staleTime: Infinity,
  });
}
