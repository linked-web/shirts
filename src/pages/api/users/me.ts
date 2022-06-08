import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@customTypes/auth';
import cookie from 'cookie';
import { API_URL } from '@config/index';

type Data = {
	user?: User;
	error?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'GET') {
		const { access } = cookie.parse(req.headers.cookie ?? '');

		if (!access) {
			return res.status(401).json({
				error: 'User unauthorized to make this request',
			});
		}

		try {
			const apiRes = await fetch(`${API_URL}/api/users/me`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${access}`,
				},
			});

			const data = await apiRes.json();

			if (apiRes.status === 200) {
				return res.status(200).json({
					user: data.user,
				});
			} else {
				return res.status(apiRes.status).json({
					error: data.error,
				});
			}
		} catch (err) {
			return res.status(500).json({
				error: 'Something went wrong when retrieving user',
			});
		}
	} else {
		res.setHeader('Allow', ['GET']);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
