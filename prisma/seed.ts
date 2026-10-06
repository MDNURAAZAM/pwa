import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Administrator",
      username: "admin",
      passwordHash,
      role: "SUPERUSER",
      isActive: true,
    },
  });

  const brands = [
    "Samsung",
    "Apple",
    "Xiaomi",
    "Redmi",
    "OnePlus",
    "Oppo",
    "Vivo",
    "Realme",
    "Tecno",
    "Infinix",
    "Itel",
    "Nokia",
    "Motorola",
    "Google",
    "Honor",
    "Nothing",
    "IQOO",
    "POCO",
    "Lava",
  ];

  for (const name of brands) {
    await prisma.brand.upsert({
      where: { name },
      update: {},
      create: {
        name,
        isActive: true,
      },
    });
  }

  console.log("Superuser created:");
  console.log({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  console.log(`Brands seeded: ${brands.length}`);
}
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
