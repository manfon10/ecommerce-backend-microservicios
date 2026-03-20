"use client";

import { Modal, Badge, Spinner, ErrorMsg } from "@/shared/components/ui";

import { useProduct } from "@/modules/products/hooks";

interface Props {
  id: string;
  onClose: () => void;
}

export function ProductDetailModal({ id, onClose }: Props) {
  const { data, isLoading, error } = useProduct(id);

  return (
    <Modal open title="Detalle de producto" onClose={onClose}>
      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {error && <ErrorMsg message={error.message} />}

      {data && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-zinc-900">{data.name}</h3>

            <Badge variant={data.is_active ? "green" : "red"}>{data.is_active ? "Activo" : "Inactivo"}</Badge>
          </div>

          {data.description && <p className="text-sm text-zinc-500">{data.description}</p>}

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Precio" value={`$${Number(data.price).toFixed(2)}`} />
            <Stat label="Exitencias" value={String(data.stock)} highlight={data.stock < 5} />
          </div>

          <div className="grid grid-cols-1 gap-1 pt-2 border-t border-zinc-100">
            <IdRow label="ID" value={data.id} />
            <IdRow label="Creado" value={new Date(data.created_at).toLocaleString()} />
            <IdRow label="Actualizado" value={new Date(data.updated_at).toLocaleString()} />
          </div>
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-zinc-50 rounded-xl p-3">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>

      <p className={`text-xl font-semibold ${highlight ? "text-red-500" : "text-zinc-900"}`}>{value}</p>
    </div>
  );
}

function IdRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-zinc-400">{label}</span>

      <span className="text-zinc-700 font-mono text-xs truncate max-w-[260px]">{value}</span>
    </div>
  );
}
