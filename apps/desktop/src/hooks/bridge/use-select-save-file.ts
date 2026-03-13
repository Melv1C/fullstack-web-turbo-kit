import { bridge } from '@/lib/bridge';
import { useMutation } from '@tanstack/react-query';

type SelectSaveFileOptions = Parameters<typeof bridge.selectSaveFile>[0];

export function useSelectSaveFile() {
  return useMutation({
    mutationFn: (options?: SelectSaveFileOptions) => bridge.selectSaveFile(options),
  });
}
