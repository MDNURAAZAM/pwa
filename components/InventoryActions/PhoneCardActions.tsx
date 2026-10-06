"use client";

import { Boxes, LineChart, Pencil, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { BuyingPriceHistoryDialog } from "./BuyingPriceHistoryDialog";
import { EditPhoneDialog } from "./EditPhoneDialog";
import { ManageStockDialog } from "./ManageStockDialog";
import { SellPhoneDialog } from "./SellPhoneDialog";

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
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

  return (
    <>
      <div className="grid w-full grid-cols-4 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-1 px-1.5 text-xs sm:w-auto sm:px-3 sm:text-sm"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-4 shrink-0" />
          <span className="truncate">Edit</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-1 px-1.5 text-xs sm:w-auto sm:px-3 sm:text-sm"
          onClick={() => setManageStockOpen(true)}
        >
          <Boxes className="size-4 shrink-0" />
          <span className="truncate">Stock</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-1 px-1.5 text-xs sm:w-auto sm:px-3 sm:text-sm"
          onClick={() => setPriceHistoryOpen(true)}
        >
          <LineChart className="size-4 shrink-0" />
          <span className="truncate">Price</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-1 px-1.5 text-xs sm:w-auto sm:px-3 sm:text-sm"
          onClick={() => setSellOpen(true)}
        >
          <ShoppingCart className="size-4 shrink-0" />
          <span className="truncate">Sell</span>
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

      <BuyingPriceHistoryDialog
        phoneName={phone.name}
        stockBatches={phone.stockBatches}
        open={priceHistoryOpen}
        onOpenChange={setPriceHistoryOpen}
      />

      <SellPhoneDialog
        phoneName={phone.name}
        stockBatches={phone.stockBatches}
        open={sellOpen}
        onOpenChange={setSellOpen}
      />
    </>
  );
}
