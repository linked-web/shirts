import {
	createContext,
	useContext,
	useReducer,
	useMemo,
	FC,
	ReactNode,
} from 'react';
import { User } from '@customTypes/auth';

interface StateModifiers {
	loadUser: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	register: (
		first_name: string,
		last_name: string,
		email: string,
		password: string
	) => Promise<void>;
	logout: () => Promise<void>;
}

interface StateValues {
	isAuthenticated: boolean;
	user: User | null | undefined;
	loading: boolean;
}

const stateModifiers: StateModifiers = {
	loadUser: async () => {},
	login: async () => {},
	register: async () => {},
	logout: async () => {},
};

const initialState: StateValues = {
	isAuthenticated: false,
	user: null,
	loading: true,
};

type State = StateValues & StateModifiers;

const AuthContext = createContext<State>({
	...stateModifiers,
	...initialState,
});

type Action = {
	type:
		| 'LOGIN_SUCCESS'
		| 'LOGIN_FAIL'
		| 'REGISTER_SUCCESS'
		| 'REGISTER_FAIL'
		| 'LOGOUT_SUCCESS'
		| 'LOGOUT_FAIL'
		| 'SET_LOADING'
		| 'REMOVE_LOADING';
	payload?: User;
};

const authReducer = (state: StateValues, action: Action) => {
	const { type, payload } = action;

	switch (type) {
		case 'LOGIN_SUCCESS': {
			return {
				...state,
				isAuthenticated: true,
				user: payload,
			};
		}
		case 'LOGIN_FAIL': {
			return {
				...state,
				isAuthenticated: false,
				user: null,
			};
		}
		case 'REGISTER_SUCCESS':
			return {
				...state,
			};
		case 'REGISTER_FAIL':
			return {
				...state,
			};
		case 'LOGOUT_SUCCESS':
			return {
				...state,
				isAuthenticated: false,
				user: null,
			};
		case 'LOGOUT_FAIL':
			return {
				...state,
			};
		case 'SET_LOADING':
			return {
				...state,
				loading: true,
			};
		case 'REMOVE_LOADING':
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
};

interface Props {
	children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	const verifyAuth = async (): Promise<boolean> => {
		try {
			const res = await fetch('/api/users/verify', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
			});

			if (res.status === 200) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	};

	const loadUser = async () => {
		const isVerified = await verifyAuth();

		dispatch({ type: 'SET_LOADING' });

		if (isVerified) {
			try {
				const res = await fetch('/api/users/me', {
					method: 'GET',
					headers: {
						Accept: 'application/json',
					},
				});

				const data = await res.json();

				if (res.status === 200) {
					dispatch({
						type: 'LOGIN_SUCCESS',
						payload: data.user,
					});
				} else {
					dispatch({ type: 'LOGIN_FAIL' });
				}
			} catch (err) {
				dispatch({ type: 'LOGIN_FAIL' });
			}
		} else {
			dispatch({ type: 'LOGIN_FAIL' });
		}

		dispatch({ type: 'REMOVE_LOADING' });
	};

	const login = async (email: string, password: string) => {
		const body = JSON.stringify({
			email,
			password,
		});

		dispatch({ type: 'SET_LOADING' });

		try {
			const res = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
			});

			if (res.status === 200) {
				try {
					const fetchUser = await fetch('/api/users/me', {
						method: 'GET',
						headers: {
							Accept: 'application/json',
						},
					});

					const userData = await res.json();

					if (fetchUser.status === 200) {
						dispatch({
							type: 'LOGIN_SUCCESS',
							payload: userData.user,
						});
					} else {
						dispatch({ type: 'LOGIN_FAIL' });
					}
				} catch (err) {
					dispatch({ type: 'LOGIN_FAIL' });
				}
			} else {
				dispatch({ type: 'LOGIN_FAIL' });
			}
		} catch (err) {
			dispatch({ type: 'LOGIN_FAIL' });
		}

		dispatch({ type: 'REMOVE_LOADING' });
	};

	const register = async (
		first_name: string,
		last_name: string,
		email: string,
		password: string
	) => {
		const body = JSON.stringify({
			first_name,
			last_name,
			email,
			password,
		});

		dispatch({ type: 'SET_LOADING' });

		try {
			const res = await fetch('/api/users/register', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
			});

			if (res.status === 201) {
				dispatch({
					type: 'REGISTER_SUCCESS',
				});
			} else {
				dispatch({ type: 'REGISTER_FAIL' });
			}
		} catch (err) {
			dispatch({ type: 'REGISTER_FAIL' });
		}

		dispatch({ type: 'REMOVE_LOADING' });
	};

	const logout = async () => {
		dispatch({ type: 'SET_LOADING' });
		try {
			const res = await fetch('/api/users/logout', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			if (res.status === 200) {
				dispatch({
					type: 'LOGOUT_SUCCESS',
				});
			} else {
				dispatch({ type: 'LOGOUT_FAIL' });
			}
		} catch (err) {
			dispatch({ type: 'LOGOUT_FAIL' });
		}
		dispatch({ type: 'REMOVE_LOADING' });
	};

	const value = useMemo(() => {
		return {
			...state,
			loadUser,
			login,
			register,
			logout,
		};
	}, [state.isAuthenticated, state.user, state.loading]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	return context;
};
