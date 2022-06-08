import { Product } from '@customTypes/product';

export interface OrderItem {
	id: number;
	product: Product;
	title: string;
	price: string;
	amount: number;
}

export interface Order {
	id: number;
	order_items: OrderItem[];
}
