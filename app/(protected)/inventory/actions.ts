"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addPhoneSchema } from "@/lib/validations/inventory";

export type AddPhoneResult = {
  success: boolean;
  message: string;
};

export type InventoryActionResult = {
  success: boolean;
  message: string;
};

export type SellPhoneResult = {
  success: boolean;
  message: string;
};
/* -------------------------------------------------------------------------- */
/* Add new phone                                                               */
/* -------------------------------------------------------------------------- */

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
    await prisma.$transaction(
      async (tx) => {
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
      },
      {
        maxWait: 10000,
        timeout: 15000,
      },
    );

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

/* -------------------------------------------------------------------------- */
/* Update phone information                                                    */
/* -------------------------------------------------------------------------- */

const updatePhoneSchema = z.object({
  phoneId: z.string().min(1),
  brandId: z.string().min(1),
  name: z.string().trim().min(1).max(150),
  ram: z.coerce.number().int().positive(),
  rom: z.coerce.number().int().positive(),
});

export async function updatePhone(
  formData: FormData,
): Promise<InventoryActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const result = updatePhoneSchema.safeParse({
    phoneId: formData.get("phoneId"),
    brandId: formData.get("brandId"),
    name: formData.get("name"),
    ram: formData.get("ram"),
    rom: formData.get("rom"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid phone information.",
    };
  }

  const data = result.data;

  try {
    const phone = await prisma.phone.findUnique({
      where: {
        id: data.phoneId,
      },
    });

    if (!phone) {
      return {
        success: false,
        message: "Phone not found.",
      };
    }

    const brand = await prisma.brand.findUnique({
      where: {
        id: data.brandId,
      },
    });

    if (!brand || !brand.isActive) {
      return {
        success: false,
        message: "Selected brand is not available.",
      };
    }

    await prisma.phone.update({
      where: {
        id: data.phoneId,
      },
      data: {
        brandId: data.brandId,
        name: data.name,
        ram: data.ram,
        rom: data.rom,
      },
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Phone updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update phone:", error);

    return {
      success: false,
      message: "Failed to update phone.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Update stock batch                                                          */
/* -------------------------------------------------------------------------- */

const updateStockBatchSchema = z.object({
  stockBatchId: z.string().min(1),
  buyingPrice: z.coerce.number().positive(),
  sellingPrice: z.coerce.number().positive(),
  purchaseDate: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export async function updateStockBatch(
  formData: FormData,
): Promise<InventoryActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const result = updateStockBatchSchema.safeParse({
    stockBatchId: formData.get("stockBatchId"),
    buyingPrice: formData.get("buyingPrice"),
    sellingPrice: formData.get("sellingPrice"),
    purchaseDate: formData.get("purchaseDate"),
    quantity: formData.get("quantity"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid stock information.",
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
    const batch = await prisma.stockBatch.findUnique({
      where: {
        id: data.stockBatchId,
      },
      include: {
        saleItems: {
          where: {
            sale: {
              status: "COMPLETED",
            },
          },
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!batch) {
      return {
        success: false,
        message: "Stock batch not found.",
      };
    }

    const soldQuantity = batch.saleItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    if (data.quantity < soldQuantity) {
      return {
        success: false,
        message: `Quantity cannot be less than sold quantity (${soldQuantity}).`,
      };
    }

    const remainingQuantity = data.quantity - soldQuantity;

    await prisma.stockBatch.update({
      where: {
        id: data.stockBatchId,
      },
      data: {
        buyingPrice: data.buyingPrice,
        sellingPrice: data.sellingPrice,
        purchaseDate,
        quantity: data.quantity,
        remainingQuantity,
      },
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Stock updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update stock:", error);

    return {
      success: false,
      message: "Failed to update stock.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Add stock to an existing phone                                              */
/* -------------------------------------------------------------------------- */

const addStockSchema = z.object({
  phoneId: z.string().min(1),
  buyingPrice: z.coerce.number().positive(),
  sellingPrice: z.coerce.number().positive(),
  purchaseDate: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export async function addStock(
  formData: FormData,
): Promise<InventoryActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const result = addStockSchema.safeParse({
    phoneId: formData.get("phoneId"),
    buyingPrice: formData.get("buyingPrice"),
    sellingPrice: formData.get("sellingPrice"),
    purchaseDate: formData.get("purchaseDate"),
    quantity: formData.get("quantity"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid stock information.",
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
    const phone = await prisma.phone.findUnique({
      where: {
        id: data.phoneId,
      },
    });

    if (!phone) {
      return {
        success: false,
        message: "Phone not found.",
      };
    }

    await prisma.stockBatch.create({
      data: {
        phoneId: data.phoneId,
        buyingPrice: data.buyingPrice,
        sellingPrice: data.sellingPrice,
        purchaseDate,
        quantity: data.quantity,
        remainingQuantity: data.quantity,
      },
    });

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Stock added successfully.",
    };
  } catch (error) {
    console.error("Failed to add stock:", error);

    return {
      success: false,
      message: "Failed to add stock.",
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Sell an existing phone                                              */
/* -------------------------------------------------------------------------- */
const sellPhoneSchema = z.object({
  stockBatchId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export async function sellPhone(formData: FormData): Promise<SellPhoneResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const result = sellPhoneSchema.safeParse({
    stockBatchId: formData.get("stockBatchId"),
    quantity: formData.get("quantity"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Invalid sale information.",
    };
  }

  const { stockBatchId, quantity } = result.data;

  try {
    const sale = await prisma.$transaction(
      async (tx) => {
        const batch = await tx.stockBatch.findUnique({
          where: {
            id: stockBatchId,
          },
        });

        if (!batch) {
          throw new Error("Stock batch not found.");
        }

        if (batch.remainingQuantity < quantity) {
          throw new Error(
            `Only ${batch.remainingQuantity} unit${
              batch.remainingQuantity === 1 ? "" : "s"
            } available.`,
          );
        }

        const totalAmount = batch.sellingPrice.mul(quantity);

        const totalProfit = batch.sellingPrice
          .sub(batch.buyingPrice)
          .mul(quantity);

        const stockUpdate = await tx.stockBatch.updateMany({
          where: {
            id: stockBatchId,
            remainingQuantity: {
              gte: quantity,
            },
          },
          data: {
            remainingQuantity: {
              decrement: quantity,
            },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new Error(
            "Stock changed before the sale could be completed. Please try again.",
          );
        }

        const newSale = await tx.sale.create({
          data: {
            userId: session.user.id,
            totalAmount,
            totalProfit,
            status: "COMPLETED",
          },
        });

        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            stockBatchId: batch.id,
            quantity,
            buyingPrice: batch.buyingPrice,
            sellingPrice: batch.sellingPrice,
            profit: totalProfit,
          },
        });

        return newSale;
      },
      {
        maxWait: 10000,
        timeout: 15000,
      },
    );

    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Sale completed successfully. Sale ID: ${sale.id}`,
    };
  } catch (error) {
    console.error("Failed to complete sale:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to complete sale.",
    };
  }
}
