import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { AlertCircle, ChevronLeft, ChevronRight, Info, Loader2 } from "lucide-react";
import { useState } from "react";

import { LogRow } from "@/features/logs/components/log-row";
import { useLogs } from "@/features/logs/hooks/use-logs";
import { useLogsStore } from "@/features/logs/logs-store";

type CronLogsTableProps = {
  path: string;
};

export function CronLogsTable({ path }: CronLogsTableProps) {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useLogs({
    page,
    pageSize: 25,
    path,
    types: ["REQUEST"],
  });

  const setSelectedLogId = useLogsStore((state) => state.setSelectedLogId);
  const setSheetOpen = useLogsStore((state) => state.setSheetOpen);

  const logs = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSelectLog = (id: number) => {
    setSelectedLogId(id);
    setSheetOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route logs</CardTitle>
        <CardDescription>Request logs for this cron endpoint</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Loading logs...</p>
          </div>
        )}

        {isError && (
          <div className="text-destructive flex flex-col items-center justify-center gap-3 py-12">
            <AlertCircle className="h-8 w-8" />
            <div className="text-center">
              <p className="text-sm font-medium">Failed to load logs</p>
              <p className="text-muted-foreground mt-1 text-xs">Please try again later</p>
            </div>
          </div>
        )}

        {!isPending && !isError && logs.length === 0 && (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12">
            <Info className="h-8 w-8" />
            <div className="text-center">
              <p className="text-sm font-medium">No logs found</p>
              <p className="mt-1 text-xs">Trigger the cron to create a request log</p>
            </div>
          </div>
        )}

        {!isPending && !isError && logs.length > 0 && (
          <div className="space-y-4">
            <ScrollArea className="h-125">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-35">Time</TableHead>
                    <TableHead className="w-25">Level</TableHead>
                    <TableHead className="w-22">Type</TableHead>
                    <TableHead className="min-w-62">Message</TableHead>
                    <TableHead className="w-22">Method</TableHead>
                    <TableHead className="min-w-50">Path</TableHead>
                    <TableHead className="w-18 text-center">Steps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <LogRow key={log.id} log={log} onSelect={handleSelectLog} />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <p className="text-xs">
                Showing {logs.length} of {pagination.total} total logs
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPage(pagination.page - 1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(pagination.page + 1)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
