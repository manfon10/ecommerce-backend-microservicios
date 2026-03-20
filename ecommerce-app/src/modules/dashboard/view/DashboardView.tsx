"use client";

import Link from "next/link";

import { useProducts } from "@/modules/products/hooks/useProducts";
import { useOrders } from "@/modules/orders/hooks";
import { Spinner } from "@/shared/components/ui";
import { StatisticCard } from "../components";

export const DashboardView = () => {
  const { data: products = [], isLoading: loadingP } = useProducts();
  const { data: orders = [], isLoading: loadingO } = useOrders();

  const loading = loadingP || loadingO;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalRevenue = orders?.reduce((s, o) => s + Number(o.total), 0);
  const lowStock = products?.filter((p) => p.stock < 5).length;
  const pending = orders?.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Productos", value: products?.length, href: "/products", color: "bg-blue-50 text-blue-700" },
    { label: "Ordenes", value: orders?.length, href: "/orders", color: "bg-violet-50 text-violet-700" },
    {
      label: "Ingresos",
      value: `$${totalRevenue.toFixed(2)}`,
      href: "/orders",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Existencias bajas",
      value: lowStock,
      href: "/products",
      color: lowStock > 0 ? "bg-red-50 text-red-600" : "bg-zinc-50 text-zinc-500",
    },
    {
      label: "Ordenes pendientes",
      value: pending,
      href: "/orders",
      color: pending > 0 ? "bg-yellow-50 text-yellow-600" : "bg-zinc-50 text-zinc-500",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>

        <p className="text-sm text-zinc-400 mt-1">Descripción general ecommerce</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatisticCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-zinc-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Ordenes recientes</h2>

            <Link href="/orders" className="text-xs text-zinc-400 hover:text-zinc-700">
              Ver todas
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-sm text-zinc-400 py-4">Aún no hay pedidos</p>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-50">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{o.customer_name}</p>
                    <p className="text-xs text-zinc-400">
                      {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900">${Number(o.total).toFixed(2)}</p>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${
                        o.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : o.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-zinc-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Resumen de existencia</h2>
            <Link href="/products" className="text-xs text-zinc-400 hover:text-zinc-700">
              Administrar
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-sm text-zinc-400 py-4">Aún no hay productos</p>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-50">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <p className="text-sm text-zinc-800 truncate max-w-[180px]">{p.name}</p>

                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          p.stock > 20 ? "bg-green-400" : p.stock > 5 ? "bg-yellow-400" : "bg-red-400"
                        }`}
                        style={{ width: `${Math.min(100, p.stock)}%` }}
                      />
                    </div>

                    <span
                      className={`text-xs font-mono w-8 text-right ${p.stock < 5 ? "text-red-500" : "text-zinc-500"}`}
                    >
                      {p.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
