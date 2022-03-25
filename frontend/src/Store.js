import { createContext, useReducer } from "react";

export const Store = createContext(); // creates an object that contains Provider and Consumer
// console.log("Store====>", Store);

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      // check if new added item was already in the cart, update it, if not add it
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => {
            return item._id === existItem._id ? newItem : item;
          })
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
}

const initialState = {
  cart: {
    cartItems: [],
  },
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
