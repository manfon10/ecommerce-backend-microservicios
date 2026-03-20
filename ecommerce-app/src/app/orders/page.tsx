import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getOrders } from "@/modules/orders/services";
import { OrdersView } from "@/modules/orders/view";

export default async function OrdersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersView />
    </HydrationBoundary>
  );
}
