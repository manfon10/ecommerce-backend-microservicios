import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getProducts } from "@/modules/products/services";
import { ProductsView } from "@/modules/products/view";

export default async function ProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView />
    </HydrationBoundary>
  );
}
