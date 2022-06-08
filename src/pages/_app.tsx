import type { AppProps } from 'next/app';
import { AuthProvider } from '@context/AuthContext';
import { CartProvider } from '@context/CartContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
	<AuthProvider>
		<CartProvider>
			<Component {...pageProps} />
		</CartProvider>
	</AuthProvider>
);

export default MyApp;
