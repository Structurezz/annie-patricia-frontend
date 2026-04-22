import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cart as cartAPI } from "../services/api";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

export interface CartItem {
  id: string;
  name: string;
  designer?: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

/* ─────────────────────────────────────────────
   HELPERS (normalize backend response)
───────────────────────────────────────────── */

const normalizeCartItems = (items: any[]): CartItem[] => {
  return items.map((item: any) => ({
    id: item._id,
    name: item.product?.name || "Product",
    designer: item.product?.designer || "",
    price: item.price,
    image: item.product?.images?.[0]?.url || "",
    quantity: item.quantity,
    size: item.size,
  }));
};

const extractItems = (response: any): any[] => {
  console.log("🧠 RAW CART RESPONSE:", response);

  // Case 1: normal shape
  if (response?.cart?.items) return response.cart.items;

  // Case 2: your current backend shape
  if (response?.data?.items) return response.data.items;

  // Case 3: sometimes backend returns full cart in data
  if (response?.data && Array.isArray(response.data.items)) {
    return response.data.items;
  }

  // Case 4: fallback
  console.warn("⚠️ No cart items found in response");
  return [];
};




/* ─────────────────────────────────────────────
   THUNKS (BACKEND SYNC)
───────────────────────────────────────────── */

// GET CART
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const response = await cartAPI.get();
  return extractItems(response);
});

export const addToCartServer = createAsyncThunk(
  "cart/add",
  async ({ id, quantity = 1, size }: { id: string; quantity?: number; size?: string }) => {
    const response = await cartAPI.add(id, quantity, size);
    return extractItems(response);
  }
);

export const removeFromCartServer = createAsyncThunk(
  "cart/remove",
  async (itemId: string) => {
    const response = await cartAPI.remove(itemId);
    return extractItems(response);
  }
);

export const updateQuantityServer = createAsyncThunk(
  "cart/update",
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    const response = await cartAPI.update(itemId, quantity);
    return extractItems(response);
  }
);

/* ─────────────────────────────────────────────
   SLICE
───────────────────────────────────────────── */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },

  extraReducers: (builder) => {
    /* ───────── FETCH ───────── */
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.loading = false;

      console.log("🔥 CART FETCH:", action.payload);

      state.items = normalizeCartItems(action.payload);
    });

    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cart";
    });

    /* ───────── ADD / UPDATE / REMOVE ───────── */
    builder.addMatcher(
      (action) =>
        action.type.endsWith("/fulfilled") &&
        action.type.startsWith("cart/") &&
        action.type !== "cart/fetch/fulfilled",

      (state, action: PayloadAction<any[]>) => {
        console.log("🔥 CART UPDATE:", action.payload);

        state.items = normalizeCartItems(action.payload);
      }
    );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;