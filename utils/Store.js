import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext(); //create Context Api from react for use in other component

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._key === newItem._key
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._key === existItem._key ? newItem : item
          ) //update existing item
        : [...state.cart.cartItems, newItem]; //adding new item
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } }; //...state means return previous state, cart: { ...state.cart, return previous state of ...state.cart and update cartItems object based on the changes in cartItems
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._key !== action.payload._key
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return { ...state, userInfo: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>; //Store.Provider is coming from Store. Store.Provider is an HOC
}
