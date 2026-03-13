import { bridge } from '@/lib/bridge';
import { useMutation } from '@tanstack/react-query';

type SelectFileOptions = Parameters<typeof bridge.selectFile>[0];

export function useSelectFile() {
  return useMutation({
    mutationFn: (options?: SelectFileOptions) => bridge.selectFile(options),
  });
}
