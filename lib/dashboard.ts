import { prisma } from "@/lib/prisma";

export async function getDashboardSummary() {
  const [
    stockBatches,
    totalPhones,
    salesSummary,
    lowStock,
    recentSales,
    recentStock,
  ] = await Promise.all([
    prisma.stockBatch.findMany({
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
    }),

    prisma.phone.count(),

    prisma.sale.aggregate({
      where: {
        status: "COMPLETED",
      },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
        totalProfit: true,
      },
    }),

    prisma.stockBatch.findMany({
      where: {
        remainingQuantity: {
          gt: 0,
          lte: 3,
        },
      },
      include: {
        phone: {
          include: {
            brand: true,
          },
        },
      },
      orderBy: {
        remainingQuantity: "asc",
      },
      take: 10,
    }),

    prisma.sale.findMany({
      where: {
        status: "COMPLETED",
      },
      orderBy: {
        saleDate: "desc",
      },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            stockBatch: {
              include: {
                phone: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.stockBatch.findMany({
      orderBy: {
        purchaseDate: "desc",
      },
      take: 5,
      include: {
        phone: {
          include: {
            brand: true,
          },
        },
      },
    }),
  ]);

  let totalUnits = 0;
  let totalBuyingValue = 0;
  let totalSellingValue = 0;

  for (const batch of stockBatches) {
    const quantity = batch.remainingQuantity;

    totalUnits += quantity;

    totalBuyingValue += quantity * Number(batch.buyingPrice);

    totalSellingValue += quantity * Number(batch.sellingPrice);
  }

  const potentialProfit = totalSellingValue - totalBuyingValue;

  return {
    totalPhones,
    totalUnits,

    totalBuyingValue,
    totalSellingValue,
    potentialProfit,

    totalSales: salesSummary._count.id,

    totalRevenue: Number(salesSummary._sum.totalAmount ?? 0),

    totalProfit: Number(salesSummary._sum.totalProfit ?? 0),

    lowStock: lowStock.map((batch) => ({
      id: batch.id,
      remainingQuantity: batch.remainingQuantity,

      buyingPrice: Number(batch.buyingPrice),
      sellingPrice: Number(batch.sellingPrice),

      phone: {
        id: batch.phone.id,
        name: batch.phone.name,
        ram: batch.phone.ram,
        rom: batch.phone.rom,

        brand: {
          id: batch.phone.brand.id,
          name: batch.phone.brand.name,
        },
      },
    })),

    recentSales: recentSales.map((sale) => ({
      id: sale.id,
      saleDate: sale.saleDate.toISOString(),

      totalAmount: Number(sale.totalAmount),
      totalProfit: Number(sale.totalProfit),

      user: {
        name: sale.user.name,
      },

      items: sale.items.map((item) => ({
        quantity: item.quantity,

        phoneName: item.stockBatch.phone.name,

        brandName: item.stockBatch.phone.brand.name,
      })),
    })),

    recentStock: recentStock.map((batch) => ({
      id: batch.id,

      purchaseDate: batch.purchaseDate.toISOString(),

      quantity: batch.quantity,
      remainingQuantity: batch.remainingQuantity,

      buyingPrice: Number(batch.buyingPrice),
      sellingPrice: Number(batch.sellingPrice),

      phone: {
        name: batch.phone.name,
        ram: batch.phone.ram,
        rom: batch.phone.rom,

        brand: {
          name: batch.phone.brand.name,
        },
      },
    })),
  };
}
