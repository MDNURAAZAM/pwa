import { z } from "zod";

export const addPhoneSchema = z.object({
  brandId: z.string().trim().min(1, "Brand is required"),

  name: z
    .string()
    .trim()
    .min(1, "Phone name is required")
    .max(150, "Phone name is too long"),

  ram: z.coerce
    .number()
    .int("RAM must be a whole number")
    .positive("RAM must be greater than 0"),

  rom: z.coerce
    .number()
    .int("ROM must be a whole number")
    .positive("ROM must be greater than 0"),

  buyingPrice: z.coerce
    .number()
    .positive("Buying price must be greater than 0"),

  sellingPrice: z.coerce
    .number()
    .positive("Selling price must be greater than 0"),

  purchaseDate: z.string().min(1, "Purchase date is required"),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

export type AddPhoneInput = z.infer<typeof addPhoneSchema>;
