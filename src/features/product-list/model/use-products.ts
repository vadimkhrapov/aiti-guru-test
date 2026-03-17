import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchProducts, type FetchProductsParams } from '../api/products';

export function useProducts(params: FetchProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params.page, params.search, params.sortBy, params.order],
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  });
}
