import { prisma } from "@/lib/prisma";

export async function getAvailableBrands() {
  return prisma.brand.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getInventory() {
  return prisma.phone.findMany({
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
}
