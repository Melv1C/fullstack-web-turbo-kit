import { bridge } from '@/lib/bridge';
import { useMutation } from '@tanstack/react-query';

export function useOpenExternal() {
  return useMutation({
    mutationFn: bridge.openExternal,
  });
}
