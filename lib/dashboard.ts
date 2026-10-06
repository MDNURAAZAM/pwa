import { prisma } from "@/lib/prisma";

export async function getDashboardSummary() {
  const stock = await prisma.stockBatch.findMany({
    where: {
      remainingQuantity: {
        gt: 0,
      },
    },
    select: {
      remainingQuantity: true,
      buyingPrice: true,
      sellingPrice: true,
    },
  });

  let totalPhones = 0;
  let totalBuyingValue = 0;
  let totalSellingValue = 0;

  for (const batch of stock) {
    const quantity = batch.remainingQuantity;
    const buyingPrice = Number(batch.buyingPrice);
    const sellingPrice = Number(batch.sellingPrice);

    totalPhones += quantity;
    totalBuyingValue += buyingPrice * quantity;
    totalSellingValue += sellingPrice * quantity;
  }

  return {
    totalPhones,
    totalBuyingValue,
    totalSellingValue,
    potentialProfit: totalSellingValue - totalBuyingValue,
  };
}
