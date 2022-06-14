import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuth } from '@context/AuthContext';
import { useCart } from '@context/CartContext';
import Layout from '@components/Layout';

const CheckoutPage: NextPage = () => {
	const router = useRouter();
	const { isAuthenticated, loading } = useAuth();
	const { cart } = useCart();

	if (
		!loading &&
		!isAuthenticated &&
		cart !== null &&
		cart !== undefined &&
		cart.length <= 0
	)
		router.push('/login');

	const getTotal = () => {
		let total = 0;

		if (cart !== null && cart !== undefined) {
			cart.map(item => {
				total += Number(item.product.price) * item.amount;
			});
		}

		return total;
	};

	const buy = async () => {
		const res = await fetch('/api/orders/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		});

		if (res.status === 201) {
			router.push('/dashboard');
		}
	};

	return (
		<Layout title='Shirts | Checkout' content='Checkout page'>
			<h1 className='mb-5'>Checkout</h1>
			<p>Order Total: ${getTotal()}</p>
			<button className='btn btn-success' onClick={buy}>
				Buy
			</button>
		</Layout>
	);
};

export default CheckoutPage;
