import { prismaWithoutLog } from "@/lib/prisma";

/**
 * Clean old logs (older than specified days)
 */
export async function cleanOldLogs(daysToKeep: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await prismaWithoutLog.log.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}
