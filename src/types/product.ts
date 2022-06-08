export interface ProductPhoto {
	photo: string;
}

export interface ProductVariant {
	title: string;
	slug: string;
	photo: string;
	price: string;
	quantity: number;
}

export interface Product {
	id: number;
	product_photos: ProductPhoto[];
	product_variants: ProductVariant[];
	title: string;
	slug: string;
	description: string;
	photo: string;
	price: string;
	quantity: number;
}
