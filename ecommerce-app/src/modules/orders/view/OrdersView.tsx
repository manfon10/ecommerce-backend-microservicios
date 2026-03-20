"use client";

import { useState } from "react";

import { useOrders, useCreateOrder } from "@/modules/orders/hooks";
import { OrderStatus, CreateOrderDto } from "@/modules/orders/types";

import { Button, Spinner, ErrorMsg, Empty, Modal, Badge } from "@/shared/components";

import { OrderForm, OrderDetailModal } from "../components";

const statusVariant: Record<OrderStatus, "green" | "yellow" | "red"> = {
  confirmed: "green",
  pending: "yellow",
  cancelled: "red",
};

export const OrdersView = () => {
  const { data: orders = [], isLoading, error } = useOrders();
  const createOrder = useCreateOrder();

  const [showCreate, setShowCreate] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  function flash(msg: string) {
    setSuccessMsg(msg);

    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleCreate(dto: CreateOrderDto) {
    await createOrder.mutateAsync(dto);

    setShowCreate(false);

    flash("Orden creada.");
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMsg message={error.message} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ordenes</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>

        <Button onClick={() => setShowCreate(true)}>+ Nueva orden</Button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {orders.length === 0 && <Empty message="Aún no hay pedidos: crea uno para empezar" />}

      {orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left px-5 py-3">Client</th>
                <th className="text-center px-5 py-3">Artículos</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-center px-5 py-3">Estado</th>
                <th className="text-left px-5 py-3">Fecha</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className={`border-t ${i === 0 ? "border-t-0" : ""}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-xs text-zinc-400">{o.customer_email}</p>
                  </td>

                  <td className="text-center">{o.items.length}</td>

                  <td className="text-right font-mono font-semibold">${Number(o.total).toFixed(2)}</td>

                  <td className="text-center">
                    <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                  </td>

                  <td className="text-xs text-zinc-400">
                    {new Date(o.created_at).toLocaleDateString("en-CO", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td>
                    <Button onClick={() => setDetailId(o.id)}>Ver</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nueva orden">
        <OrderForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      {detailId && <OrderDetailModal id={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
};
