import type { NextPage } from 'next';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@context/AuthContext';
import Layout from '@components/Layout';

const LoginPage: NextPage = () => {
	const router = useRouter();
	const { login, loading, isAuthenticated } = useAuth();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		await login(email, password);
	};

	if (typeof window !== 'undefined' && !loading && isAuthenticated)
		router.push('/dashboard');

	return (
		<Layout title='Shirts | Login' content='Login page'>
			<h1>Log Into Your Account</h1>
			<form onSubmit={onSubmit}>
				<div className='form-group mt-5'>
					<label className='form-label' htmlFor='email'>
						Email
					</label>
					<input
						className='form-control'
						type='email'
						name='email'
						onChange={onChange}
						value={email}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='password'>
						Password
					</label>
					<input
						className='form-control'
						type='password'
						name='password'
						onChange={onChange}
						value={password}
						required
					/>
				</div>
				{loading ? (
					<div>Loading...</div>
				) : (
					<button className='btn btn-primary mt-3'>Login</button>
				)}
			</form>
		</Layout>
	);
};

export default LoginPage;
