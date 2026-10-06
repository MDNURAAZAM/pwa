import { prisma } from "@/lib/prisma";

export async function getAvailableBrands() {
  const phones = await prisma.phone.findMany({
    distinct: ["brand"],
    select: {
      brand: true,
    },
    orderBy: {
      brand: "asc",
    },
  });

  return phones.map((phone) => phone.brand);
}
