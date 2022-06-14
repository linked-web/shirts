import {
	createContext,
	useContext,
	useReducer,
	useMemo,
	FC,
	ReactNode,
} from 'react';
import { Cart, CartItem } from '@customTypes/cart';
import { API_URL } from '@config/index';

interface StateModifiers {
	getCart: () => Promise<void>;
	updateCart: (product_id: number, amount: number) => Promise<void>;
	deleteCartItem: (product_id: number) => Promise<void>;
}

interface StateValues {
	cart: CartItem[] | null | undefined;
}

const stateModifiers: StateModifiers = {
	getCart: async () => {},
	updateCart: async () => {},
	deleteCartItem: async () => {},
};

const initialState: StateValues = {
	cart: null,
};

type State = StateValues & StateModifiers;

const CartContext = createContext<State>({
	...stateModifiers,
	...initialState,
});

type Action = {
	type:
		| 'GET_CART_SUCCESS'
		| 'GET_CART_FAIL'
		| 'UPDATE_CART_SUCCESS'
		| 'UPDATE_CART_FAIL'
		| 'DELETE_CART_ITEM_SUCCESS'
		| 'DELETE_CART_ITEM_FAIL';
	payload?: CartItem[];
};

const cartReducer = (state: StateValues, action: Action) => {
	const { type, payload } = action;

	switch (type) {
		case 'GET_CART_SUCCESS': {
			return {
				...state,
				cart: payload,
			};
		}
		case 'GET_CART_FAIL': {
			return {
				...state,
			};
		}
		case 'UPDATE_CART_SUCCESS':
			return {
				...state,
				cart: payload,
			};
		case 'UPDATE_CART_FAIL':
			return {
				...state,
			};
		case 'DELETE_CART_ITEM_SUCCESS':
			return {
				...state,
			};
		case 'DELETE_CART_ITEM_FAIL':
			return {
				...state,
			};
		default:
			return state;
	}
};

interface Props {
	children: ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	const getCart = async () => {
		try {
			const res = await fetch(`${API_URL}/api/cart/`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
				mode: 'cors',
				credentials: 'include',
			});

			const data: Cart = await res.json();

			if (res.status === 200) {
				dispatch({
					type: 'GET_CART_SUCCESS',
					payload: data.cart,
				});
			} else {
				dispatch({ type: 'GET_CART_FAIL' });
			}
		} catch (err) {
			dispatch({ type: 'GET_CART_FAIL' });
		}
	};

	const updateCart = async (product_id: number, amount: number) => {
		const body = JSON.stringify({ product_id, amount });
		console.log('Product ID: ', product_id);
		console.log('Amount: ', amount);

		try {
			const res = await fetch(`${API_URL}/api/cart/`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
				mode: 'cors',
				credentials: 'include',
			});

			const data: Cart = await res.json();

			if (res.status === 201) {
				dispatch({
					type: 'UPDATE_CART_SUCCESS',
					payload: data.cart,
				});
			} else {
				dispatch({ type: 'UPDATE_CART_FAIL' });
			}
		} catch (err) {
			dispatch({ type: 'UPDATE_CART_FAIL' });
		}
	};

	const deleteCartItem = async (product_id: number) => {
		const body = JSON.stringify({ product_id });

		try {
			const res = await fetch(`${API_URL}/api/cart/`, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
				mode: 'cors',
				credentials: 'include',
			});

			if (res.status === 204) {
				dispatch({
					type: 'DELETE_CART_ITEM_SUCCESS',
				});
			} else {
				dispatch({ type: 'DELETE_CART_ITEM_FAIL' });
			}
		} catch (err) {
			dispatch({ type: 'DELETE_CART_ITEM_FAIL' });
		}
	};

	const value = useMemo(() => {
		return {
			...state,
			getCart,
			updateCart,
			deleteCartItem,
		};
	}, [state.cart]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const context = useContext(CartContext);

	return context;
};
