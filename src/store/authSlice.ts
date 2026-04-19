import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { auth as authApi, AuthUser, getToken } from "../services/api";

/* ── thunks ─────────────────────────────────────────── */

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authApi.register(firstName, lastName, email, password);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authApi.login(email, password);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.getProfile();
    return res.user;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

/* ── slice ──────────────────────────────────────────── */

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    setUser(state, action: PayloadAction<AuthUser | null>) { state.user = action.payload; },
  },
  extraReducers: builder => {
    /* register */
    builder.addCase(registerUser.pending,   s => { s.loading = true; s.error = null; });
    builder.addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; });
    builder.addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });

    /* login */
    builder.addCase(loginUser.pending,   s => { s.loading = true; s.error = null; });
    builder.addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; });
    builder.addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; });

    /* logout */
    builder.addCase(logoutUser.fulfilled, s => { s.user = null; });

    /* profile */
    builder.addCase(fetchProfile.pending,   s => { s.loading = true; });
    builder.addCase(fetchProfile.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.initialized = true; });
    builder.addCase(fetchProfile.rejected,  s => { s.loading = false; s.initialized = true; });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
