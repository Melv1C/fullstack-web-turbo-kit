import { bridge } from '@/lib/bridge';
import { useQuery } from '@tanstack/react-query';

export function useListFiles(dirPath: string | null) {
  return useQuery({
    queryKey: ['files', dirPath],
    queryFn: () => bridge.listFiles(dirPath!),
    enabled: !!dirPath,
  });
}
