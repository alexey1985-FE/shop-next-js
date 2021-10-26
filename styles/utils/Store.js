import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();
const userInfo = Cookies.get('userInfo');

const initialState = {
	darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
	cart: {
		cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
	},
	userInfo: userInfo ? JSON.parse(userInfo) : null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'DARK_MODE_ON':
			return { ...state, darkMode: true };
		case 'DARK_MODE_OFF':
			return { ...state, darkMode: false };
		case 'ADD_CART_ITEM': {
			const newItem = action.payload;
			const existItem = state.cart.cartItems.find(item => item._id === newItem._id);

			const cartItems = existItem
				? state.cart.cartItems.map(item => (item.name === existItem.name ? newItem : item))
				: [...state.cart.cartItems, newItem];
			Cookies.set('cartItems', JSON.stringify(cartItems));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case 'REMOVE_CART_ITEM': {
			const cartItems = state.cart.cartItems.filter(item => item._id !== action.payload._id);
			Cookies.set('cartItems', JSON.stringify(cartItems));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case 'USER_LOGIN':
			return { ...state, userInfo: action.payload };
		default:
			return state;
	}
}

export function StoreProvider(props) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };
	return <Store.Provider value={value}>{props.children}</Store.Provider>;
}