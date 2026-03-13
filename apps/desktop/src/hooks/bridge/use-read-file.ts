import { bridge } from '@/lib/bridge';
import { useQuery } from '@tanstack/react-query';

export function useReadFile(filePath: string | null) {
  return useQuery({
    queryKey: ['file', filePath],
    queryFn: () => bridge.readFile(filePath!),
    enabled: !!filePath,
  });
}
