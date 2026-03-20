import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@melv1c/ui-core";
import type { LogStep, LogWithUser } from "@repo/utils";
import { AlertCircle, Check, Clock, Copy, Loader2, User } from "lucide-react";
import { useState } from "react";

import { useLog } from "../hooks/use-logs";
import { useLogsStore } from "../logs-store";
import { levelConfig } from "../utils";

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${time}.${ms}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      title={label ?? "Copy to clipboard"}
      className="h-6 px-2"
    >
      {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

function MetadataDisplay({ metadata, label }: { metadata: unknown; label: string }) {
  if (!metadata || (typeof metadata === "object" && Object.keys(metadata as object).length === 0)) {
    return null;
  }

  const metadataString = JSON.stringify(metadata, null, 2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          {label}
        </h3>
        <CopyButton text={metadataString} label="Copy metadata" />
      </div>
      <div className="bg-muted/50 overflow-x-auto rounded-md border">
        <pre className="max-h-75 overflow-y-auto p-3 text-xs leading-relaxed whitespace-pre">
          {metadataString}
        </pre>
      </div>
    </div>
  );
}

function StepItem({ step, index }: { step: LogStep; index: number }) {
  const config = levelConfig[step.level];
  const Icon = config.icon;

  const bgColorMap = {
    debug: "bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700",
    info: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    warn: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
  };

  return (
    <div className={`rounded-lg border p-4 ${bgColorMap[step.level]}`}>
      <div className="flex items-start gap-3">
        <div className="bg-background flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm">
          <span className="text-muted-foreground text-xs font-semibold">{index + 1}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={config.variant} className="gap-1 text-xs uppercase">
              <Icon className="h-3 w-3" />
              {step.level}
            </Badge>
            <span className="text-muted-foreground text-xs font-medium">
              {formatTimestamp(step.timestamp)}
            </span>
          </div>
          <p className="text-sm leading-relaxed wrap-break-word">{step.message}</p>
          <MetadataDisplay metadata={step.metadata} label="Step Metadata" />
        </div>
      </div>
    </div>
  );
}

function LogContent({ log }: { log: LogWithUser }) {
  const config = levelConfig[log.level];
  const Icon = config.icon;

  return (
    <div className="h-[calc(100vh-8rem)] space-y-6 overflow-y-auto pr-4 pb-6">
      {/* Header Info with visual hierarchy */}
      <div className="bg-card space-y-3 rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={config.variant} className={`gap-1 uppercase ${config.color}`}>
            <Icon className="h-3 w-3" />
            {log.level}
          </Badge>
          <Badge variant="secondary">{log.type}</Badge>
          {log.method && (
            <Badge variant="outline" className="font-mono">
              {log.method}
            </Badge>
          )}
          {log.statusCode && (
            <Badge
              variant={log.statusCode >= 400 ? "destructive" : "secondary"}
              className="font-mono"
            >
              {log.statusCode}
            </Badge>
          )}
        </div>

        {/* Main Message */}
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Message
          </h4>
          <p className="text-sm leading-relaxed wrap-break-word">{log.message}</p>
        </div>
      </div>

      {/* Request Details */}
      {(log.path || log.durationMs !== null) && (
        <div className="bg-card space-y-4 rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Request Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {log.path && (
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-xs font-medium">Path</h4>
                <p className="bg-muted/50 rounded-md p-2.5 font-mono text-xs break-all">
                  {log.path}
                </p>
              </div>
            )}
            {log.durationMs !== null && log.durationMs !== undefined && (
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-xs font-medium">Duration</h4>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  {log.durationMs}ms
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timestamps and User */}
      <div className="bg-card space-y-4 rounded-lg border p-4">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Additional Information
        </h3>

        <div className="space-y-2">
          <h4 className="text-muted-foreground text-xs font-medium">Created At</h4>
          <p className="text-sm font-medium">{formatDate(log.createdAt)}</p>
        </div>

        {log.user ? (
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs font-medium">User</h4>
            <div className="bg-muted/50 flex items-center gap-3 rounded-md p-2.5">
              <Avatar className="h-8 w-8">
                <AvatarImage src={log.user.image ?? undefined} alt={log.user.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{log.user.name}</p>
                <p className="text-muted-foreground truncate text-xs">{log.user.email}</p>
              </div>
            </div>
          </div>
        ) : log.userId ? (
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs font-medium">User ID</h4>
            <p className="bg-muted/50 rounded-md p-2.5 font-mono text-xs break-all">{log.userId}</p>
          </div>
        ) : null}
      </div>

      {/* Metadata */}
      {log.metadata &&
        typeof log.metadata === "object" &&
        Object.keys(log.metadata as object).length > 0 && (
          <div className="bg-card rounded-lg border p-4">
            <MetadataDisplay metadata={log.metadata} label="Metadata" />
          </div>
        )}

      {/* Steps */}
      {log.steps && log.steps.length > 0 && (
        <div className="bg-card space-y-4 rounded-lg border p-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Execution Steps ({log.steps.length})
          </h3>
          <div className="space-y-3">
            {log.steps.map((step, idx) => (
              <StepItem key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LogDetailSheet() {
  const logId = useLogsStore((state) => state.selectedLogId);
  const { data: log, isPending, isError } = useLog(logId);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      useLogsStore.getState().setSelectedLogId(null);
    }
  };

  if (!logId) {
    return null;
  }

  return (
    <Sheet open={!!logId} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full p-4 sm:max-w-200">
        <SheetHeader>
          <SheetTitle>Log Details</SheetTitle>
          <SheetDescription>{`Log ID: ${logId}`}</SheetDescription>
        </SheetHeader>

        {isPending && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-destructive flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8" />
            <p className="mt-2 text-sm">Failed to load log details</p>
          </div>
        )}

        {log && <LogContent log={log} />}
      </SheetContent>
    </Sheet>
  );
}
