import { useEffect, FC, ReactNode } from 'react';
import Head from 'next/head';
import Script from 'next/script';
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
				<link
					href='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css'
					rel='stylesheet'
					integrity='sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor'
					crossOrigin='anonymous'
				/>
			</Head>
			<Navbar />
			<main className='container mt-5 mb-5'>{children}</main>
			<Script
				src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js'
				integrity='sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2'
				crossOrigin='anonymous'
			/>
		</>
	);
};

export default Layout;
