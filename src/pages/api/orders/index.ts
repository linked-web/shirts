import type { NextApiRequest, NextApiResponse } from 'next';
import { Order } from '@customTypes/order';
import cookie from 'cookie';
import { API_URL } from '@config/index';

type Data = {
	orders?: Order[];
	order?: Order;
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
			const apiRes = await fetch(`${API_URL}/api/orders/`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${access}`,
				},
				mode: 'cors',
			});

			const data = await apiRes.json();

			if (apiRes.status === 200) {
				return res.status(200).json({
					orders: data,
				});
			} else {
				return res.status(apiRes.status).json({
					error: 'Failed to retrieve orders',
				});
			}
		} catch (err) {
			return res.status(500).json({
				error: 'Something went wrong when retrieving orders',
			});
		}
	} else if (req.method === 'POST') {
		const { access } = cookie.parse(req.headers.cookie ?? '');
		const { sessionid } = req.cookies;

		if (!access) {
			return res.status(401).json({
				error: 'User unauthorized to make this request',
			});
		}

		try {
			const apiRes = await fetch(`${API_URL}/api/orders/create`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${access}`,
					Cookie: `sessionid=${sessionid}`,
				},
				credentials: 'include',
				mode: 'cors',
			});

			const data = await apiRes.json();

			if (apiRes.status === 201) {
				return res.status(201).json({
					order: data.order,
				});
			} else {
				return res.status(apiRes.status).json({
					error: 'Failed to create order',
				});
			}
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				error: 'Something went wrong when creatig order',
			});
		}
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
