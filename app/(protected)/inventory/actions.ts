"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addPhoneSchema } from "@/lib/validations/inventory";

export type AddPhoneResult = {
  success: boolean;
  message: string;
};

export async function addPhone(formData: FormData): Promise<AddPhoneResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const rawData = {
    brandId: formData.get("brandId"),
    name: formData.get("name"),
    ram: formData.get("ram"),
    rom: formData.get("rom"),
    buyingPrice: formData.get("buyingPrice"),
    sellingPrice: formData.get("sellingPrice"),
    purchaseDate: formData.get("purchaseDate"),
    quantity: formData.get("quantity"),
  };

  const result = addPhoneSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const data = result.data;

  if (data.sellingPrice < data.buyingPrice) {
    return {
      success: false,
      message: "Selling price cannot be lower than buying price.",
    };
  }

  const purchaseDate = new Date(`${data.purchaseDate}T00:00:00`);

  if (Number.isNaN(purchaseDate.getTime())) {
    return {
      success: false,
      message: "Invalid purchase date.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const phone = await tx.phone.create({
        data: {
          brandId: data.brandId,
          name: data.name,
          ram: data.ram,
          rom: data.rom,
        },
      });

      await tx.stockBatch.create({
        data: {
          phoneId: phone.id,
          buyingPrice: data.buyingPrice,
          sellingPrice: data.sellingPrice,
          purchaseDate,
          quantity: data.quantity,
          remainingQuantity: data.quantity,
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/inventory");

    return {
      success: true,
      message: "Phone added successfully.",
    };
  } catch (error) {
    console.error("Failed to add phone:", error);

    return {
      success: false,
      message: "Failed to add phone.",
    };
  }
}
