import { bridge } from '@/lib/bridge';
import { useQuery } from '@tanstack/react-query';

export function useFileExists(filePath: string | null) {
  return useQuery({
    queryKey: ['fileExists', filePath],
    queryFn: () => bridge.fileExists(filePath!),
    enabled: !!filePath,
  });
}
