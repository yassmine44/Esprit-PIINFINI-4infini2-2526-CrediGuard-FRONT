export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  id: number;
  userId: number;
  status: 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED';
  items: CartItem[];
  total: number;
}

export interface AddItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}