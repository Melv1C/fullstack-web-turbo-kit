export type CronConfig = {
  id: string;
  name: string;
  description: string;
  path: string;
  defaultBody: string;
};

export const crons = [
  {
    id: "log-cleanup",
    name: "Log cleanup",
    description: "Deletes old application logs after the configured retention window.",
    path: "/api/cron/log-cleanup",
    defaultBody: JSON.stringify({ daysToKeep: 30 }, null, 2),
  },
] satisfies CronConfig[];

export function getCronById(id: string) {
  return crons.find((cron) => cron.id === id) ?? null;
}
