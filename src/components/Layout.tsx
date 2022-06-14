import { useEffect, FC, ReactNode } from 'react';
import Head from 'next/head';
import { useAuth } from '@context/AuthContext';
import { useCart } from '@context/CartContext';
import Navbar from '@components/Navbar';

interface Props {
	title: string;
	content: string;
	children: ReactNode;
}

const Layout: FC<Props> = ({ title, content, children }) => {
	const { loadUser } = useAuth();
	const { getCart } = useCart();

	useEffect(() => {
		const fetchUser = async () => {
			await loadUser();
		};
		const fetchCart = async () => {
			await getCart();
		};

		fetchUser();
		fetchCart();
	}, []);

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name='description' content={content} />
			</Head>
			<Navbar />
			<main className='container mt-5 mb-5'>{children}</main>
		</>
	);
};

export default Layout;
