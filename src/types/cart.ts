import { Product } from '@customTypes/product';

export interface CartItem {
	product_id: number;
	product: Product;
	amount: number;
}

export interface Cart {
	cart: CartItem[];
}
