import type { NextPage } from 'next';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import Layout from '@components/Layout';

const RegisterPage: NextPage = () => {
	const { register, loading } = useAuth();
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
	});

	const { first_name, last_name, email, password } = formData;

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		await register(first_name, last_name, email, password);
	};

	return (
		<Layout title='Shirts | Register' content='Register page'>
			<h1>Register For An Account</h1>
			<form onSubmit={onSubmit}>
				<div className='form-group mt-5'>
					<label className='form-label' htmlFor='first_name'>
						First Name
					</label>
					<input
						className='form-control'
						type='text'
						name='first_name'
						onChange={onChange}
						value={first_name}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='last_name'>
						Last Name
					</label>
					<input
						className='form-control'
						type='text'
						name='last_name'
						onChange={onChange}
						value={last_name}
						required
					/>
				</div>
				<div className='form-group mt-3'>
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
					<button className='btn btn-primary mt-3'>Register Account</button>
				)}
			</form>
		</Layout>
	);
};

export default RegisterPage;
