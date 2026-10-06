import { prisma } from "@/lib/prisma";

export async function getAvailableBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

type GetInventoryOptions = {
  search?: string;
  brandId?: string;
  ram?: number;
  rom?: number;
  minPrice?: number;
  maxPrice?: number;
  batchFrom?: string;
  batchTo?: string;
  sort?: "buying-asc" | "buying-desc" | "selling-asc" | "selling-desc";
};

function getBatchDateFilter(batchFrom?: string, batchTo?: string) {
  if (!batchFrom && !batchTo) {
    return undefined;
  }

  const filter: {
    gte?: Date;
    lt?: Date;
  } = {};

  if (batchFrom) {
    filter.gte = new Date(`${batchFrom}T00:00:00`);
  }

  if (batchTo) {
    const endDate = new Date(`${batchTo}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);
    filter.lt = endDate;
  }

  return filter;
}

export async function getInventory(options: GetInventoryOptions = {}) {
  const search = options.search?.trim();

  const batchDateFilter = getBatchDateFilter(
    options.batchFrom,
    options.batchTo,
  );

  const phones = await prisma.phone.findMany({
    where: {
      ...(search
        ? {
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
          }
        : {}),

      ...(options.brandId
        ? {
            brandId: options.brandId,
          }
        : {}),

      ...(options.ram
        ? {
            ram: options.ram,
          }
        : {}),

      ...(options.rom
        ? {
            rom: options.rom,
          }
        : {}),

      ...(options.minPrice !== undefined ||
      options.maxPrice !== undefined ||
      batchDateFilter
        ? {
            stockBatches: {
              some: {
                ...(options.minPrice !== undefined
                  ? {
                      sellingPrice: {
                        gte: options.minPrice,
                      },
                    }
                  : {}),

                ...(options.maxPrice !== undefined
                  ? {
                      sellingPrice: {
                        lte: options.maxPrice,
                      },
                    }
                  : {}),

                ...(batchDateFilter
                  ? {
                      purchaseDate: batchDateFilter,
                    }
                  : {}),
              },
            },
          }
        : {}),
    },

    include: {
      brand: {
        select: {
          id: true,
          name: true,
        },
      },

      stockBatches: {
        orderBy: {
          purchaseDate: "desc",
        },

        select: {
          id: true,
          buyingPrice: true,
          sellingPrice: true,
          purchaseDate: true,
          quantity: true,
          remainingQuantity: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (!options.sort) {
    return phones;
  }

  return [...phones].sort((a, b) => {
    const aBatch = a.stockBatches[0];
    const bBatch = b.stockBatches[0];

    if (!aBatch && !bBatch) {
      return 0;
    }

    if (!aBatch) {
      return 1;
    }

    if (!bBatch) {
      return -1;
    }

    switch (options.sort) {
      case "buying-asc":
        return Number(aBatch.buyingPrice) - Number(bBatch.buyingPrice);

      case "buying-desc":
        return Number(bBatch.buyingPrice) - Number(aBatch.buyingPrice);

      case "selling-asc":
        return Number(aBatch.sellingPrice) - Number(bBatch.sellingPrice);

      case "selling-desc":
        return Number(bBatch.sellingPrice) - Number(aBatch.sellingPrice);

      default:
        return 0;
    }
  });
}
