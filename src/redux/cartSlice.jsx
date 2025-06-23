import { createSlice } from '@reduxjs/toolkit';

// Safely parse localStorage with error handling
const getInitialCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch (error) {
    console.error('Failed to parse cart data', error);
    return [];
  }
};

const initialState = getInitialCart();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },
    deleteFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
    incrementQuantity: (state, action) => {
      const item = state.find(item => item.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.find(item => item.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    clearCart: () => {
      return [];
    },
  },
});

// Action creators
export const {
  addToCart,
  deleteFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartTotal = (state) =>
  state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectCartItemsCount = (state) =>
  state.cart.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
