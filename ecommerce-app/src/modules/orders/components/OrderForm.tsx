"use client";
import { useState } from "react";

import { Button, Input, ErrorMsg, Spinner } from "@/shared/components/ui";

import { CreateOrderDto, OrderItemDto } from "@/modules/orders/types";
import { useProducts } from "@/modules/products/hooks";

interface Props {
  onSubmit: (dto: CreateOrderDto) => Promise<void>;
  onCancel: () => void;
}

export function OrderForm({ onSubmit, onCancel }: Props) {
  const { data: products, isLoading: loadingProducts } = useProducts();

  const [form, setForm] = useState({ customer_name: "", customer_email: "" });
  const [items, setItems] = useState<OrderItemDto[]>([{ product_id: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function addItem() {
    setItems((prev) => [...prev, { product_id: "", quantity: 1 }]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof OrderItemDto, value: string | number) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    const invalid = items.some((i) => !i.product_id || i.quantity < 1);

    if (invalid) {
      setError("Rellene todos los campos del producto");

      return;
    }

    setLoading(true);

    try {
      await onSubmit({ ...form, items });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const total = items.reduce((sum, item) => {
    const product = products?.find((p) => p.id === item.product_id);

    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nombre cliente"
          value={form.customer_name}
          onChange={setField("customer_name")}
          required
          placeholder="Juan Pérez"
        />
        <Input
          label="Correo cliente"
          type="email"
          value={form.customer_email}
          onChange={setField("customer_email")}
          required
          placeholder="juan@email.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-700">Artículos</p>

          <Button type="button" variant="ghost" onClick={addItem} className="text-xs px-2 py-1">
            + Agregar artículo
          </Button>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                {i === 0 && <p className="text-xs text-zinc-400 mb-1">Producto</p>}

                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(i, "product_id", e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-white"
                >
                  <option value="">Seleccione producto...</option>

                  {products?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${Number(p.price).toFixed(2)} (stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                {i === 0 && <p className="text-xs text-zinc-400 mb-1">Existencias</p>}

                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)}
                />
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="mb-0.5 p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {total > 0 && (
        <div className="flex justify-between items-center py-3 px-4 bg-zinc-50 rounded-xl">
          <span className="text-sm text-zinc-500">Total estimado</span>

          <span className="text-lg font-semibold text-zinc-900">${total.toFixed(2)}</span>
        </div>
      )}

      {error && <ErrorMsg message={error} />}

      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={loading} className="flex-1">
          Crear orden
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
