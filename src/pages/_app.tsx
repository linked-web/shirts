import Script from 'next/script';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@context/AuthContext';
import { CartProvider } from '@context/CartContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
	<AuthProvider>
		<CartProvider>
			<Component {...pageProps} />
			<Script
				src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js'
				integrity='sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2'
				crossOrigin='anonymous'
			/>
		</CartProvider>
	</AuthProvider>
);

export default MyApp;
