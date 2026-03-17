import { useQuery } from '@tanstack/react-query'

export interface Product {
  id: string
  name: string
  vendor: string
  sku: string
  rating: number
  price: number
  subcategory?: string
}

interface UseProductsParams {
  page?: number
  search?: string
}

async function fetchProducts(_params: UseProductsParams): Promise<Product[]> {
  // TODO: заменить на реальный API
  return []
}

export function useProducts(params: UseProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params.page, params.search],
    queryFn: () => fetchProducts(params),
  })
}
