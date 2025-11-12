// src/store/wishlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './index';

interface WishlistState {
  items: number[]; // product IDs only
}

/* -------------------------------------------------
   localStorage helpers – identical to cartSlice
   ------------------------------------------------- */
const loadWishlistFromStorage = (): number[] => {
  const saved = localStorage.getItem('wishlist');
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'number') : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: number[]) => {
  localStorage.setItem('wishlist', JSON.stringify(items));
};

/* -------------------------------------------------
   Initial state – loads once, just like cart
   ------------------------------------------------- */
const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

/* -------------------------------------------------
   Slice – same structure as cartSlice
   ------------------------------------------------- */
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.items.includes(id)) {
        state.items.push(id);
        saveWishlistToStorage(state.items);
      }
    },

    removeFromWishlist: (state, action: PayloadPayload<number>) => {
      state.items = state.items.filter(i => i !== action.payload);
      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },

    // Sync from other tabs (same pattern as cart, but optional)
    syncWishlist: (state, action: PayloadAction<number[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  syncWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

/* -------------------------------------------------
   Thunk – sync across tabs (same as you’d do for cart)
   ------------------------------------------------- */
export const initWishlistSync = () => (dispatch: AppDispatch) => {
  const sync = () => {
    const fresh = loadWishlistFromStorage();
    dispatch(syncWishlist(fresh));
  };

  // Initial sync
  sync();

  // React to other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'wishlist') sync();
  });

  // React to tab focus (optional, catches manual edits)
  window.addEventListener('focus', sync);

  // Cleanup
  return () => {
    window.removeEventListener('storage', sync);
    window.removeEventListener('focus', sync);
  };
};