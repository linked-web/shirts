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
	if (req.method === 'GET') {
		const { access } = cookie.parse(req.headers.cookie ?? '');

		if (!access) {
			return res.status(403).json({
				error: 'User forbidden from making this request',
			});
		}

		const body = JSON.stringify({
			token: access,
		});

		try {
			const apiRes = await fetch(`${API_URL}/api/token/verify/`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
			});

			if (apiRes.status === 200) {
				return res.status(200).json({ success: 'Authenticated successfully' });
			} else {
				return res
					.status(apiRes.status)
					.json({ error: 'Authentication failed' });
			}
		} catch (err) {
			return res.status(500).json({ error: 'Authentication failed' });
		}
	} else {
		res.setHeader('Allow', ['GET']);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
