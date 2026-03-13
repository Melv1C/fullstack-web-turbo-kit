import { bridge } from '@/lib/bridge';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bridge.deleteFile,
    onSuccess: (_data, filePath) => {
      queryClient.invalidateQueries({ queryKey: ['file', filePath] });
    },
  });
}
