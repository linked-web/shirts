import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from 'next';
import { forwardRef, HTMLProps } from 'react';
import type { Product } from '@customTypes/product';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@components/Layout';
import { API_URL } from '@config';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	let data: Product[] | undefined;

	try {
		const res = await fetch(`${API_URL}/api/products/`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		});

		data = await res.json();
	} catch (err) {}

	return {
		props: {
			products: data,
		},
	};
}

interface Props {
	product: Product;
}

type LinkProps = HTMLProps<HTMLAnchorElement> & Props;

const ProductImage = forwardRef<HTMLAnchorElement, LinkProps>(
	({ product, href }, ref) => (
		<a
			className='d-block position-relative bg-dark'
			style={{ width: '100%', height: '14rem' }}
			href={href}
			ref={ref}
		>
			<Image
				src={product.photo}
				alt={product.title}
				layout='fill'
				objectFit='contain'
			/>
		</a>
	)
);

ProductImage.displayName = 'ProductImage';

const HomePage = ({
	products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
	<Layout title='Shirts | Home' content='Home page'>
		<h1 className='mb-5'>Shop Shirts</h1>
		<div className='grid'>
			{products !== undefined &&
				products.map((product: Product) => (
					<div key={product.id} className='g-col-4'>
						<div className='card' style={{ width: '18rem' }}>
							<Link href={`/products/${product.slug}`} passHref>
								<ProductImage product={product} />
							</Link>
							<div className='card-body'>
								<h5 className='card-title'>{product.title}</h5>
								<p className='card-text'>{product.description}</p>
								<Link href={`/products/${product.slug}`}>
									<a className='btn btn-primary'>View Product</a>
								</Link>
							</div>
						</div>
					</div>
				))}
		</div>
	</Layout>
);

export default HomePage;
