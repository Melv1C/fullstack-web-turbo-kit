import { bridge } from '@/lib/bridge';
import { useQuery } from '@tanstack/react-query';

export function usePing() {
  return useQuery({
    queryKey: ['ping'],
    queryFn: bridge.ping,
  });
}
