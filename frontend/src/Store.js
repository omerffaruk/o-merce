import { createContext, useReducer } from "react";

export const Store = createContext(); // creates an object that contains Provider and Consumer

const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  cart: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    shippingAddress: JSON.parse(localStorage.getItem("shippingAddress")) || {},
    paymentMethod: localStorage.getItem("paymentMethod") || "",
  },
};

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
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case "CART_REMOVE_ITEM":
      const itemToRemove = action.payload;
      const cartItemsAfterRemove = state.cart.cartItems.filter((item) => {
        return item._id !== itemToRemove._id;
      });
      localStorage.setItem("cartItems", JSON.stringify(cartItemsAfterRemove));
      return {
        ...state,
        cart: { ...state.cart, cartItems: cartItemsAfterRemove },
      };
    case "EMPTY_CART":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
