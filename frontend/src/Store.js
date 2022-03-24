import { createContext, useReducer } from "react";

export const Store = createContext(); // creates an object that contains Provider and Consumer
// console.log("Store====>", Store);

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      //add item to the cartItems
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, action.payload],
        },
      };
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
