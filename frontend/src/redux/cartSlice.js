import { createSlice } from "@reduxjs/toolkit";

const storedCartItems = localStorage.getItem("cartItems");

const initialState = {
  cartItems: storedCartItems
    ? JSON.parse(storedCartItems).map((item) => ({
        ...item,
        _id: item._id ?? item.productId,
        imageUrl: item.imageUrl ?? item.image,
        qty: item.qty ?? item.quantity ?? 1,
      }))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        existItem.qty += item.qty || 1;
      } else {
        state.cartItems.push({ ...item, qty: item.qty || 1 });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateCartQuantity: (state, action) => {
      const { itemId, qty } = action.payload;
      const item = state.cartItems.find((x) => x._id === itemId);
      if (item) {
        item.qty = qty;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== itemId);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
 
    }
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
