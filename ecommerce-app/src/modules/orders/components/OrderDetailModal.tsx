"use client";

import { Modal, Badge, Spinner, ErrorMsg } from "@/shared/components/ui";

import { useOrder } from "@/modules/orders/hooks";
import { OrderStatus } from "@/modules/orders/types";

const statusVariant: Record<OrderStatus, "green" | "yellow" | "red"> = {
  confirmed: "green",
  pending: "yellow",
  cancelled: "red",
};

interface Props {
  id: string;
  onClose: () => void;
}

export function OrderDetailModal({ id, onClose }: Props) {
  const { data, isLoading, error } = useOrder(id);

  return (
    <Modal open title="Detalle de orden" onClose={onClose}>
      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {error && <ErrorMsg message={error.message} />}

      {data && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-zinc-900">{data.customer_name}</p>
              <p className="text-sm text-zinc-400">{data.customer_email}</p>
            </div>

            <Badge variant={statusVariant[data.status]}>{data.status}</Badge>
          </div>

          <div className="border border-zinc-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left px-4 py-2 text-zinc-500 font-medium">Producto</th>
                  <th className="text-right px-4 py-2 text-zinc-500 font-medium">Cantidad</th>
                  <th className="text-right px-4 py-2 text-zinc-500 font-medium">Precio unitario</th>
                  <th className="text-right px-4 py-2 text-zinc-500 font-medium">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-100">
                    <td className="px-4 py-2.5 text-zinc-800">{item.product_name}</td>
                    <td className="px-4 py-2.5 text-right text-zinc-600">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-right text-zinc-600">${Number(item.unit_price).toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-zinc-800">
                      ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="border-t-2 border-zinc-200 bg-zinc-50">
                <tr>
                  <td colSpan={3} className="px-4 py-2.5 text-right text-sm font-medium text-zinc-500">
                    Total
                  </td>

                  <td className="px-4 py-2.5 text-right font-bold text-zinc-900">${Number(data.total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-col gap-1 pt-1 border-t border-zinc-100">
            {[
              { label: "Orden ID", value: data.id },
              { label: "Creada", value: new Date(data.created_at).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 text-sm">
                <span className="text-zinc-400">{label}</span>

                <span className="text-zinc-700 font-mono text-xs">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
