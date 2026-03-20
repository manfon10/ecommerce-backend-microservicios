"use client";

import { useState } from "react";

import { Button, Input, Textarea, ErrorMsg } from "@/shared/components/ui";

import { CreateProductDto, Product } from "@/modules/products/types";

interface ProductFormProps {
  initial?: Product;
  onSubmit: (dto: CreateProductDto) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initial, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    stock: initial?.stock ?? "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      await onSubmit({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error :(");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nombre" value={form.name} onChange={set("name")} required placeholder="Camiseta Larga" />

      <Textarea
        label="Descripción (optional)"
        value={form.description}
        onChange={set("description")}
        rows={3}
        placeholder="Breve descripción del producto..."
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Precio (COP)"
          type="number"
          step="1000"
          min="0"
          value={form.price}
          onChange={set("price")}
          required
          placeholder="15000"
        />
        <Input
          label="Existencias"
          type="number"
          min="0"
          value={form.stock}
          onChange={set("stock")}
          required
          placeholder="50"
        />
      </div>

      {error && <ErrorMsg message={error} />}

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {initial ? "Guardar" : "Crear"}
        </Button>

        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
