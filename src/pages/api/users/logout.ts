import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

type Data = {
	success?: string;
	error?: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'POST') {
		res.setHeader(
			'Set-Cookie',
			cookie.serialize('access', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV !== 'development',
				expires: new Date(0),
				sameSite: 'strict',
				path: '/api/',
			})
		);

		return res.status(200).json({ success: 'Logged out successfully' });
	} else {
		res.setHeader('Allow', ['POST']);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
