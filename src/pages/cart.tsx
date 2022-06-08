import type { NextPage } from 'next';
import { forwardRef, HTMLProps } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@context/CartContext';
import Layout from '@components/Layout';
import { API_URL } from '@config/index';
import { CartItem } from '@customTypes/cart';

interface Props {
	item: CartItem;
}

type LinkProps = HTMLProps<HTMLAnchorElement> & Props;

const CartProductImage = forwardRef<HTMLAnchorElement, LinkProps>(
	({ item, href }, ref) => (
		<a
			className='d-block position-relative bg-dark'
			style={{ width: '100%', height: '14rem' }}
			href={href}
			ref={ref}
		>
			<Image
				src={`${API_URL}${item.product.photo}`}
				alt={item.product.title}
				layout='fill'
				objectFit='contain'
			/>
		</a>
	)
);

CartProductImage.displayName = 'CartProductImage';

const CartPage: NextPage = () => {
	const { cart, getCart, deleteCartItem } = useCart();

	const deleteItem = async (productId: number) => {
		await deleteCartItem(productId);
		await getCart();
	};

	return (
		<Layout title='Shirts | Cart' content='Cart page'>
			<h1 className='mb-5'>Manage Your Cart</h1>
			{cart !== null && cart !== undefined && cart.length <= 0 && (
				<p>No items in cart.</p>
			)}
			<div className='row mb-5'>
				{cart !== null &&
					cart !== undefined &&
					cart.map(item => (
						<div key={item.product.slug} className='col-md-4'>
							<div className='card' style={{ width: '18rem' }}>
								<Link href={`/products/${item.product.slug}`} passHref>
									<CartProductImage item={item} />
								</Link>
								<div className='card-body'>
									<h5 className='card-title'>{item.product.title}</h5>
									<p>${item.product.price}</p>
									<p className='card-text'>Amount: {item.amount}</p>
									<Link href={`/products/${item.product.slug}`}>
										<a className='btn btn-primary'>View Product</a>
									</Link>
									<p
										className='text-decoration-underline text-danger cursor-pointer mt-3'
										role='button'
										onClick={() => deleteItem(item.product_id)}
									>
										Remove Item
									</p>
								</div>
							</div>
						</div>
					))}
			</div>
			<Link href='/checkout'>
				<a className='btn btn-success'>Proceed To Checkout</a>
			</Link>
		</Layout>
	);
};

export default CartPage;
