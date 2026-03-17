import { apiRequest } from '@/shared/api/base';
import type { Product } from '@/entities/product';

interface DummyJsonProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  brand?: string;
  sku?: string;
  thumbnail?: string;
}

interface ProductsResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

function mapToProduct(raw: DummyJsonProduct): Product {
  return {
    id: String(raw.id),
    name: raw.title,
    category: raw.category,
    vendor: raw.brand ?? '',
    sku: raw.sku ?? '',
    rating: raw.rating ?? 0,
    price: raw.price ?? 0,
    imageUrl: raw.thumbnail,
  };
}

export type SortField = 'price' | 'rating' | 'name';

const SORT_TO_API: Record<SortField, string> = {
  price: 'price',
  rating: 'rating',
  name: 'title',
};

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: SortField;
  order?: 'asc' | 'desc';
}

export async function fetchProducts(
  params: FetchProductsParams = {},
): Promise<{ products: Product[]; total: number }> {
  const { page = 1, limit = 20, search, sortBy, order } = params;
  const skip = (page - 1) * limit;

  if (search) {
    const data = await apiRequest<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(search)}`,
    );
    let products = data.products.map(mapToProduct);

    if (sortBy) {
      const key = sortBy;
      const ord = order ?? 'asc';
      products = [...products].sort((a, b) => {
        const aVal = a[key as keyof Product];
        const bVal = b[key as keyof Product];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          const diff = (aVal ?? 0) - (bVal ?? 0);
          return ord === 'desc' ? -diff : diff;
        }
        const aStr = (aVal != null ? String(aVal) : '').toLowerCase();
        const bStr = (bVal != null ? String(bVal) : '').toLowerCase();
        const aEmpty = aStr === '';
        const bEmpty = bStr === '';
        if (aEmpty && bEmpty) return 0;
        if (aEmpty) return ord === 'asc' ? 1 : -1;
        if (bEmpty) return ord === 'asc' ? -1 : 1;
        const cmp = aStr.localeCompare(bStr, undefined, { sensitivity: 'base' });
        return ord === 'desc' ? -cmp : cmp;
      });
    }

    const total = products.length;
    const paginated = products.slice(skip, skip + limit);
    return { products: paginated, total };
  }

  const queryParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });
  if (sortBy && sortBy in SORT_TO_API) {
    queryParams.set('sortBy', SORT_TO_API[sortBy]);
    queryParams.set('order', order ?? 'asc');
  }

  const data = await apiRequest<ProductsResponse>(
    `/products?${queryParams.toString()}`,
  );

  return {
    products: data.products.map(mapToProduct),
    total: data.total,
  };
}
