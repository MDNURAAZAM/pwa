"use client";

import { Boxes, Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EditPhoneDialog } from "./EditPhoneDialog";
import { ManageStockDialog } from "./ManageStockDialog";

type Brand = {
  id: string;
  name: string;
};

type StockBatch = {
  id: string;
  buyingPrice: number;
  sellingPrice: number;
  purchaseDate: string;
  quantity: number;
  remainingQuantity: number;
};

type Phone = {
  id: string;
  name: string;
  ram: number;
  rom: number;
  brand: {
    id: string;
    name: string;
  };
  stockBatches: StockBatch[];
};

type PhoneCardActionsProps = {
  phone: Phone;
  brands: Brand[];
};

export function PhoneCardActions({ phone, brands }: PhoneCardActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [manageStockOpen, setManageStockOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-4" />
          Edit
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setManageStockOpen(true)}
        >
          <Boxes className="size-4" />
          Stock
        </Button>
      </div>

      <EditPhoneDialog
        phone={{
          id: phone.id,
          name: phone.name,
          ram: phone.ram,
          rom: phone.rom,
          brand: phone.brand,
        }}
        brands={brands}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ManageStockDialog
        phoneId={phone.id}
        phoneName={phone.name}
        stockBatches={phone.stockBatches}
        open={manageStockOpen}
        onOpenChange={setManageStockOpen}
      />
    </>
  );
}
