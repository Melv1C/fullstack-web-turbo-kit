import { bridge } from '@/lib/bridge';
import { useMutation } from '@tanstack/react-query';

export function useShowMessageBox() {
  return useMutation({
    mutationFn: bridge.showMessageBox,
  });
}
