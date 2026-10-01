import { prisma } from "@/lib/db";

const USD_TO_HTG_KEY = "usd_to_htg_rate";
const DEFAULT_RATE = 132;

export async function getUsdToHtgRate(): Promise<number> {
  const row = await prisma.settings.findUnique({ where: { key: USD_TO_HTG_KEY } });
  const rate = row ? parseFloat(row.value) : NaN;
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_RATE;
}

export async function setUsdToHtgRate(rate: number): Promise<void> {
  await prisma.settings.upsert({
    where: { key: USD_TO_HTG_KEY },
    update: { value: String(rate) },
    create: { key: USD_TO_HTG_KEY, value: String(rate) },
  });
}
