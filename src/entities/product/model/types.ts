export interface Product {
  id: string;
  name: string;
  category: string;
  vendor: string;
  sku: string;
  rating: number;
  price: number;
  imageUrl?: string;
}
