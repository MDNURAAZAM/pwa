"use client";

import { useState, useTransition } from "react";

import { updatePhone } from "@/app/(protected)/inventory/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type Brand = {
  id: string;
  name: string;
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
};

type EditPhoneDialogProps = {
  phone: Phone;
  brands: Brand[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditPhoneDialog({
  phone,
  brands,
  open,
  onOpenChange,
}: EditPhoneDialogProps) {
  const [isPending, startTransition] = useTransition();

  const [brandId, setBrandId] = useState(phone.brand.id);
  const [name, setName] = useState(phone.name);
  const [ram, setRam] = useState(String(phone.ram));
  const [rom, setRom] = useState(String(phone.rom));
  const [message, setMessage] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setBrandId(phone.brand.id);
      setName(phone.name);
      setRam(String(phone.ram));
      setRom(String(phone.rom));
      setMessage("");
    }

    onOpenChange(nextOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const formData = new FormData();

    formData.set("phoneId", phone.id);
    formData.set("brandId", brandId);
    formData.set("name", name);
    formData.set("ram", ram);
    formData.set("rom", rom);

    startTransition(async () => {
      const result = await updatePhone(formData);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Phone</DialogTitle>

          <DialogDescription>
            Update the phone&apos;s basic information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>

            <Select
              value={brandId}
              onValueChange={(value) => {
                if (value) {
                  setBrandId(value);
                }
              }}
            >
              <SelectTrigger className="h-11 w-full min-w-0">
                <span className="min-w-0 flex-1 truncate text-left">
                  {brands.find((brand) => brand.id === brandId)?.name ??
                    "Select brand"}
                </span>
              </SelectTrigger>

              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone name */}
          <div className="space-y-2">
            <label htmlFor="edit-phone-name" className="text-sm font-medium">
              Phone name
            </label>

            <Input
              id="edit-phone-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Galaxy A56"
              className="h-11"
              required
            />
          </div>

          {/* RAM / ROM */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="edit-phone-ram" className="text-sm font-medium">
                RAM (GB)
              </label>

              <Input
                id="edit-phone-ram"
                type="number"
                min="1"
                value={ram}
                onChange={(event) => setRam(event.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-phone-rom" className="text-sm font-medium">
                ROM (GB)
              </label>

              <Input
                id="edit-phone-rom"
                type="number"
                min="1"
                value={rom}
                onChange={(event) => setRom(event.target.value)}
                className="h-11"
                required
              />
            </div>
          </div>

          {message && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {message}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
