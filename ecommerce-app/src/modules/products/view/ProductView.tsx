"use client";

import { useState } from "react";

import { Button, Spinner, ErrorMsg, Empty, Modal, Badge } from "@/shared/components/ui";

import { Product, CreateProductDto } from "@/modules/products/types";
import { useProducts, useCreateProduct, useUpdateProduct } from "@/modules/products/hooks";

import { ProductForm, ProductDetailModal } from "../components";

export const ProductsView = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  function flash(msg: string) {
    setSuccessMsg(msg);

    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleCreate(dto: CreateProductDto) {
    await createProduct.mutateAsync(dto);

    setShowCreate(false);

    flash("Producto creado.");
  }

  async function handleUpdate(dto: CreateProductDto) {
    if (!editing) return;

    await updateProduct.mutateAsync({ id: editing.id, dto });

    setEditing(null);

    flash("Producto actualizado.");
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
          <h1 className="text-2xl font-bold text-zinc-900">Productos</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} in catalog
          </p>
        </div>

        <Button onClick={() => setShowCreate(true)}>Nuevo</Button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          ✔ {successMsg}
        </div>
      )}

      {products.length === 0 && <Empty message="No products yet — create one to get started" />}

      {products.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left px-5 py-3">Nombre</th>
                <th className="text-right px-5 py-3">Precio</th>
                <th className="text-right px-5 py-3">Existencias</th>
                <th className="text-center px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className={`border-t ${i === 0 ? "border-t-0" : ""}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{p.name}</p>

                    {p.description && <p className="text-xs text-zinc-400 truncate max-w-[300px]">{p.description}</p>}
                  </td>

                  <td className="px-5 py-3.5 text-right font-mono">${Number(p.price).toFixed(2)}</td>

                  <td className="px-5 py-3.5 text-right">
                    <span className={p.stock < 5 ? "text-red-500" : ""}>{p.stock}</span>
                  </td>

                  <td className="text-center">
                    <Badge variant={p.is_active ? "green" : "red"}>{p.is_active ? "Activo" : "Inactivo"}</Badge>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 justify-end">
                      <Button onClick={() => setDetailId(p.id)}>Ver</Button>

                      <Button onClick={() => setEditing(p)}>Editar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo producto">
        <ProductForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar producto">
        {editing && <ProductForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}
      </Modal>

      {detailId && <ProductDetailModal id={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
};
