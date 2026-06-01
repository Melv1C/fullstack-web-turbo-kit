import {
  Badge,
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
} from "@repo/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Clipboard, Play, Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ENV } from "varlock/env";

import { CronLogsTable, getCronById } from "@/features/cron";
import { LogDetailSheet } from "@/features/logs";

function shellSingleQuote(value: string) {
  return `'${value.replaceAll("'", "'\"'\"'")}'`;
}

function CronDetailPage() {
  const { cron } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [body, setBody] = useState(cron.defaultBody);
  const [copied, setCopied] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);

  const endpoint = `${ENV.BACKEND_URL}${cron.path}`;
  const curlCommand = useMemo(
    () =>
      [
        `curl -X POST ${shellSingleQuote(endpoint)}`,
        `  -H ${shellSingleQuote("content-type: application/json")}`,
        `  -H ${shellSingleQuote("x-cron-secret: $CRON_SECRET")}`,
        `  -d ${shellSingleQuote(body)}`,
      ].join(" \\\n"),
    [body, endpoint],
  );

  const triggerCron = useMutation({
    mutationFn: async () => {
      let parsedBody: unknown;
      try {
        parsedBody = JSON.parse(body);
      } catch {
        throw new Error("Body must be valid JSON");
      }

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(parsedBody),
      });

      const text = await res.text();
      setResponseText(text);

      if (!res.ok) {
        throw new Error(text || res.statusText);
      }

      return text;
    },
    onSuccess: async () => {
      toast.success("Cron triggered");
      await queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    toast.success("Curl command copied");
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Link
              to="/cron"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-2" })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cron jobs
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">{cron.name}</h2>
              </div>
              <p className="text-muted-foreground text-sm">{cron.description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit font-mono">
            {cron.path}
          </Badge>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
          <Card>
            <CardHeader>
              <CardTitle>Request body</CardTitle>
              <CardDescription>Edit the JSON payload used to trigger this cron</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cron-body">Body</Label>
                <Textarea
                  id="cron-body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="min-h-52 font-mono text-sm"
                  spellCheck={false}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => triggerCron.mutate()} disabled={triggerCron.isPending}>
                  <Play className="mr-2 h-4 w-4" />
                  {triggerCron.isPending ? "Triggering..." : "Trigger"}
                </Button>
              </div>
              {responseText && (
                <pre className="bg-muted max-h-48 overflow-auto rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
                  {responseText}
                </pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Curl command
              </CardTitle>
              <CardDescription>Uses the current request body and a secret placeholder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted max-h-80 overflow-auto rounded-md p-3 font-mono text-xs whitespace-pre-wrap">
                {curlCommand}
              </pre>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
                Copy
              </Button>
            </CardContent>
          </Card>
        </div>

        <CronLogsTable path={cron.path} />
      </div>
      <LogDetailSheet />
    </>
  );
}

export const Route = createFileRoute("/cron/$cronId")({
  beforeLoad: ({ params }) => {
    const cron = getCronById(params.cronId);

    if (!cron) {
      throw notFound();
    }

    return { cron };
  },
  component: CronDetailPage,
});
