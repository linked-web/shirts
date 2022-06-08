import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from 'next';
import { useState, ChangeEvent, FormEvent } from 'react';
import type { Product } from '@customTypes/product';
import Image from 'next/image';
import { useCart } from '@context/CartContext';
import Layout from '@components/Layout';
import { API_URL } from '@config';

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
	const { slug } = query;

	let data: Product | undefined;

	try {
		const res = await fetch(`${API_URL}/api/products/${slug}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		});

		data = await res.json();
	} catch (err) {}

	return {
		props: {
			product: data,
		},
	};
}

const ProductDetailPage = ({
	product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { updateCart } = useCart();
	const [quantity, setQuantity] = useState(1);

	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setQuantity(Number(e.target.value));
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (product !== undefined) await updateCart(product.id, quantity);
	};

	return (
		<Layout
			title={`Shirts | ${product !== undefined && product.title}`}
			content='Product detail page'
		>
			<div className='row'>
				<div className='col-md-8'>
					<div
						className='position-relative bg-dark'
						style={{ width: '100%', height: '28rem' }}
					>
						<Image
							src={`${product !== undefined && product.photo}`}
							alt={product !== undefined ? product.title : ''}
							layout='fill'
							objectFit='contain'
						/>
					</div>
				</div>
				<div className='col-md-4'>
					<h1 className='mb-5'>{product !== undefined && product.title}</h1>
					<p>${product !== undefined && product.price}</p>
					<p>{product !== undefined && product.description}</p>
					<form onSubmit={onSubmit}>
						<div className='form-group'>
							<label className='form-label'>Quantity</label>
							<select
								className='form-select mb-3'
								onChange={onChange}
								value={quantity}
							>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
								<option value={6}>6</option>
								<option value={7}>7</option>
								<option value={8}>8</option>
								<option value={9}>9</option>
							</select>
						</div>
						<button className='btn btn-warning'>Add To Cart</button>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default ProductDetailPage;
