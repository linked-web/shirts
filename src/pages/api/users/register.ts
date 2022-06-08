import type { NextApiRequest, NextApiResponse } from 'next';
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
		const { first_name, last_name, email, password } = req.body;

		const body = JSON.stringify({
			first_name,
			last_name,
			email,
			password,
		});

		try {
			const apiRes = await fetch(`${API_URL}/api/users/register`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
			});

			const data = await apiRes.json();

			if (apiRes.status === 201) {
				return res.status(201).json({ success: data.success });
			} else {
				return res.status(apiRes.status).json({ error: data.error });
			}
		} catch (err) {
			return res.status(500).json({
				error: 'Something went wrong when registering for an account',
			});
		}
	} else {
		res.setHeader('Allow', ['POST']);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
