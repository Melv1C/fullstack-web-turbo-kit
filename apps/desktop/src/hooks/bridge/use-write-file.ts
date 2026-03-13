import { bridge } from '@/lib/bridge';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useWriteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ filePath, content }: { filePath: string; content: string }) =>
      bridge.writeFile(filePath, content),
    onSuccess: (_data, { filePath }) => {
      queryClient.invalidateQueries({ queryKey: ['file', filePath] });
    },
  });
}
