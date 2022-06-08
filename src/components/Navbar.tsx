import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@context/AuthContext';

const Navbar: FC = () => {
	const router = useRouter();
	const { logout, isAuthenticated } = useAuth();

	const guestLinks = (
		<>
			<li className='nav-item'>
				<Link href='/register'>
					<a
						className={
							router.pathname === '/register' ? 'nav-link active' : 'nav-link'
						}
					>
						Register
					</a>
				</Link>
			</li>
			<li className='nav-item'>
				<Link href='/login'>
					<a
						className={
							router.pathname === '/login' ? 'nav-link active' : 'nav-link'
						}
					>
						Login
					</a>
				</Link>
			</li>
		</>
	);

	const authLinks = (
		<li className='nav-item'>
			<a className='nav-link' href='#!' onClick={logout}>
				Logout
			</a>
		</li>
	);

	const dashboardLink = (
		<li className='nav-item'>
			<Link href='/dashboard'>
				<a
					className={
						router.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'
					}
				>
					Dashboard
				</a>
			</Link>
		</li>
	);

	return (
		<nav className='navbar navbar-expand-lg bg-light'>
			<div className='container-fluid'>
				<Link href='/'>
					<a className='navbar-brand'>Shirts</a>
				</Link>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarNav'
					aria-controls='navbarNav'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarNav'>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<Link href='/'>
								<a
									className={
										router.pathname === '/' ? 'nav-link active' : 'nav-link'
									}
								>
									Home
								</a>
							</Link>
						</li>
						{isAuthenticated && dashboardLink}
						<li className='nav-item'>
							<Link href='/cart'>
								<a
									className={
										router.pathname === '/cart' ? 'nav-link active' : 'nav-link'
									}
								>
									Cart
								</a>
							</Link>
						</li>
						{isAuthenticated ? authLinks : guestLinks}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
