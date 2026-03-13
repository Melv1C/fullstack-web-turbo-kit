import { bridge } from '@/lib/bridge';
import { useQuery } from '@tanstack/react-query';

export function useAppVersion() {
  return useQuery({
    queryKey: ['appVersion'],
    queryFn: bridge.getAppVersion,
    staleTime: Infinity,
  });
}
