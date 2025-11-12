// src/store/wishlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  items: number[]; // array of product IDs
}

const loadWishlistFromStorage = (): number[] => {
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: number[]) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save wishlist:', err);
  }
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<number>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(id => id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;