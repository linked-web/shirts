import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { API_URL } from '@config/index';

type Data = {
	success?: string;
	error?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'POST') {
		const { email, password } = req.body;

		const body = JSON.stringify({ email, password });

		try {
			const apiRes = await fetch(`${API_URL}/api/token/`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
			});

			const data = await apiRes.json();

			if (apiRes.status === 200) {
				res.setHeader(
					'Set-Cookie',
					cookie.serialize('access', data.access, {
						httpOnly: true,
						secure: process.env.NODE_ENV !== 'development',
						maxAge: 60 * 30,
						sameSite: 'strict',
						path: '/api/',
					})
				);

				return res.status(200).json({
					success: 'Logged in successfully',
				});
			} else {
				return res.status(apiRes.status).json({
					error: 'Authentication failed',
				});
			}
		} catch (err) {
			return res.status(500).json({
				error: 'Authentication failed',
			});
		}
	} else {
		res.setHeader('Allow', ['POST']);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
