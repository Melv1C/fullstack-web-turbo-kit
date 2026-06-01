import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";

import { crons } from "@/features/cron";

function CronListPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/cron") {
    return <Outlet />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cron jobs</CardTitle>
        <CardDescription>Select a cron to inspect and trigger it</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {crons.map((cron) => (
            <Link
              key={cron.id}
              to="/cron/$cronId"
              params={{ cronId: cron.id }}
              className="hover:bg-muted/50 flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Clock3 className="text-primary h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium">{cron.name}</h3>
                  <p className="text-muted-foreground text-sm">{cron.description}</p>
                  <p className="text-muted-foreground mt-1 truncate font-mono text-xs">
                    {cron.path}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute("/cron")({
  component: CronListPage,
});
