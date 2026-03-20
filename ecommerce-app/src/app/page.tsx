import { dehydrate, QueryClient } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

import { DashboardView } from "@/modules/dashboard/view";
import { getOrders } from "@/modules/orders/services";
import { getProducts } from "@/modules/products/services";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["products"],
      queryFn: getProducts,
    }),
    queryClient.prefetchQuery({
      queryKey: ["orders"],
      queryFn: getOrders,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView />
    </HydrationBoundary>
  );
}
