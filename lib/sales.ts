import { prisma } from "@/lib/prisma";

export type SalesFilters = {
  search?: string;
  from?: string;
  to?: string;
};

function getDateFilter(from?: string, to?: string) {
  if (!from && !to) return undefined;

  const filter: { gte?: Date; lt?: Date } = {};

  if (from) {
    filter.gte = new Date(`${from}T00:00:00`);
  }

  if (to) {
    const endDate = new Date(`${to}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);
    filter.lt = endDate;
  }

  return filter;
}

export async function getSales(filters: SalesFilters = {}) {
  const search = filters.search?.trim();
  const saleDate = getDateFilter(filters.from, filters.to);

  const sales = await prisma.sale.findMany({
    where: {
      status: "COMPLETED",

      ...(saleDate ? { saleDate } : {}),

      ...(search
        ? {
            items: {
              some: {
                stockBatch: {
                  phone: {
                    OR: [
                      {
                        name: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        brand: {
                          name: {
                            contains: search,
                            mode: "insensitive",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          }
        : {}),
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
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

    orderBy: {
      saleDate: "desc",
    },
  });

  // IMPORTANT:
  // Everything returned from this function is now a plain
  // JSON-serializable object. No Prisma Decimal or Date
  // instances are returned.

  return sales.map((sale) => ({
    id: sale.id,
    userId: sale.userId,
    saleDate: sale.saleDate.toISOString(),

    totalAmount: Number(sale.totalAmount),
    totalProfit: Number(sale.totalProfit),

    status: sale.status,
    createdAt: sale.createdAt.toISOString(),
    updatedAt: sale.updatedAt.toISOString(),

    user: {
      id: sale.user.id,
      name: sale.user.name,
      username: sale.user.username,
    },

    items: sale.items.map((item) => ({
      id: item.id,
      saleId: item.saleId,
      stockBatchId: item.stockBatchId,

      quantity: item.quantity,

      buyingPrice: Number(item.buyingPrice),
      sellingPrice: Number(item.sellingPrice),
      profit: Number(item.profit),

      createdAt: item.createdAt.toISOString(),

      stockBatch: {
        id: item.stockBatch.id,

        buyingPrice: Number(item.stockBatch.buyingPrice),

        sellingPrice: Number(item.stockBatch.sellingPrice),

        purchaseDate: item.stockBatch.purchaseDate.toISOString(),

        quantity: item.stockBatch.quantity,

        remainingQuantity: item.stockBatch.remainingQuantity,

        phone: {
          id: item.stockBatch.phone.id,
          name: item.stockBatch.phone.name,
          ram: item.stockBatch.phone.ram,
          rom: item.stockBatch.phone.rom,

          brand: {
            id: item.stockBatch.phone.brand.id,
            name: item.stockBatch.phone.brand.name,
          },
        },
      },
    })),
  }));
}

export async function getSalesSummary(filters: SalesFilters = {}) {
  const sales = await getSales(filters);

  return {
    totalSales: sales.length,

    totalQuantity: sales.reduce(
      (total, sale) =>
        total +
        sale.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0),
      0,
    ),

    totalAmount: sales.reduce((total, sale) => total + sale.totalAmount, 0),

    totalProfit: sales.reduce((total, sale) => total + sale.totalProfit, 0),
  };
}
