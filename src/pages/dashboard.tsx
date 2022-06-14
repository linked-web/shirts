import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@context/AuthContext';
import Layout from '@components/Layout';
import { Order } from '@customTypes/order';

const DashboardPage: NextPage = () => {
	const router = useRouter();
	const { isAuthenticated, user, loading } = useAuth();

	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await fetch('/api/orders/list', {
					method: 'GET',
					headers: {
						Accept: 'application/json',
					},
				});
				const data = await res.json();
				setOrders(data.orders);
			} catch (err) {}
		};
		fetchOrders();
	}, []);

	if (typeof window !== 'undefined' && !isAuthenticated && !loading)
		router.push('/login');

	return (
		<Layout title='Shirts | Dashboard' content='Dashboard page'>
			<h1 className='mb-5'>
				Welcome {user !== null && user !== undefined && user.first_name}
			</h1>
			<ul className='list-group'>
				{orders.map(order => (
					<li key={order.id} className='list-group-item'>
						<ul className='list-group'>
							{order.order_items.map(order_item => (
								<li
									key={`${order.id}--${order_item.id}`}
									className='list-group-item'
								>
									<h3>{order_item.title}</h3>
									<p>Price: ${order_item.price}</p>
									<p>Amount Ordered: {order_item.amount}</p>
									<Link href={`/products/${order_item.product.slug}`}>
										<a className='btn btn-primary btn-sm'>View Product</a>
									</Link>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</Layout>
	);
};

export default DashboardPage;
