/* ─────────────────────────────────────────────────────────
   Annie Patricia — API Service Layer
   Base URL: import.meta.env.VITE_API_URL
───────────────────────────────────────────────────────── */

const BASE = import.meta.env.VITE_API_URL ?? "https://annie-backend-p1th.onrender.com";

/* ── helpers ──────────────────────────────────────────── */

function getToken(): string | null {
  return localStorage.getItem("ap_token");
}

function setToken(token: string) {
  localStorage.setItem("ap_token", token);
}

function clearToken() {
  localStorage.removeItem("ap_token");
}

function getSessionId(): string {
  let id = localStorage.getItem("ap_session");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("ap_session", id);
  }
  return id;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Session-Id": getSessionId(),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any).message ?? `HTTP ${res.status}`);
  }
  return data as T;
}

const get  = <T>(path: string)              => request<T>("GET",    path);
const post = <T>(path: string, body: unknown) => request<T>("POST",   path, body);
const put  = <T>(path: string, body: unknown) => request<T>("PUT",    path, body);
const del  = <T>(path: string)              => request<T>("DELETE", path);

/* ═══════════════════════════════════════════════════════
   AUTH
═══════════════════════════════════════════════════════ */

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  recipient: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export const auth = {
  register: async (firstName: string, lastName: string, email: string, password: string): Promise<AuthUser> => {
    const res = await post<AuthResponse>("/api/auth/register", { firstName, lastName, email, password });
    setToken(res.token);
    return res.user;
  },

  login: async (email: string, password: string): Promise<AuthUser> => {
    const res = await post<AuthResponse>("/api/auth/login", { email, password });
    setToken(res.token);
    return res.user;
  },

  logout: async () => {
    try { await post("/api/auth/logout", {}); } catch {}
    clearToken();
  },

  getProfile: (): Promise<{ success: boolean; user: AuthUser }> =>
    get("/api/auth/profile"),

  updateProfile: (data: Partial<AuthUser>): Promise<{ success: boolean; user: AuthUser }> =>
    put("/api/auth/profile", data),

  changePassword: (currentPassword: string, newPassword: string) =>
    put("/api/auth/change-password", { currentPassword, newPassword }),

  forgotPassword: (email: string) =>
    post("/api/auth/forgot-password", { email }),

  addAddress: (address: Omit<Address, "_id">) =>
    post("/api/auth/addresses", address),

  updateAddress: (id: string, address: Partial<Address>) =>
    put(`/api/auth/addresses/${id}`, address),

  deleteAddress: (id: string) =>
    del(`/api/auth/addresses/${id}`),
};

/* ═══════════════════════════════════════════════════════
   PRODUCTS
═══════════════════════════════════════════════════════ */

export interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  badge?: string;
  stock: number;
  designer?: string;
  rating?: number;
  reviewCount?: number;
}

export const products = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return get<{ success: boolean; products: BackendProduct[]; total: number }>(`/api/products${qs}`);
  },

  getOne: (id: string) =>
    get<{ success: boolean; product: BackendProduct }>(`/api/products/${id}`),

  getFeatured: () =>
    get<{ success: boolean; products: BackendProduct[] }>("/api/products/featured"),

  getCategories: () =>
    get<{ success: boolean; categories: string[] }>("/api/products/categories"),

  getRelated: (id: string) =>
    get<{ success: boolean; products: BackendProduct[] }>(`/api/products/${id}/related`),

  addReview: (id: string, rating: number, comment: string) =>
    post(`/api/products/${id}/reviews`, { rating, comment }),
};

/* ═══════════════════════════════════════════════════════
   CART (supports guest session)
═══════════════════════════════════════════════════════ */

export interface CartItem {
  _id: string;
  product: { _id: string; name: string; price: number; images: string[]; designer?: string };
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface CartData {
  _id: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  coupon?: { code: string; discount: number };
  total: number;
}

export const cart = {
  get: () =>
    get<{ success: boolean; cart: CartData }>("/api/cart"),

  add: (productId: string, quantity = 1, size?: string) =>
    post<{ success: boolean; cart: CartData }>("/api/cart/add", { productId, quantity, size }),

  update: (itemId: string, quantity: number) =>
    put<{ success: boolean; cart: CartData }>(`/api/cart/item/${itemId}`, { quantity }),

  remove: (itemId: string) =>
    del<{ success: boolean; cart: CartData }>(`/api/cart/item/${itemId}`),

  clear: () =>
    del<{ success: boolean }>("/api/cart"),

  applyCoupon: (code: string) =>
    post<{ success: boolean; cart: CartData; discount: number }>("/api/cart/coupon", { code }),

  removeCoupon: () =>
    del("/api/cart/coupon"),
};

/* ═══════════════════════════════════════════════════════
   ORDERS
═══════════════════════════════════════════════════════ */

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface BackendOrder {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentReference?: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  items: Array<{ product: string; quantity: number; size?: string }>;
  shippingAddress: Omit<Address, "_id">;
  email?: string;
  couponCode?: string;
}

export const orders = {
  create: (payload: CreateOrderPayload) =>
    post<{ success: boolean; order: BackendOrder; paymentUrl?: string; reference?: string }>("/api/orders", payload),

  verifyPayment: (reference: string) =>
    get<{ success: boolean; order: BackendOrder }>(`/api/orders/verify/${reference}`),

  getMyOrders: () =>
    get<{ success: boolean; orders: BackendOrder[] }>("/api/orders/my-orders"),

  getOne: (id: string) =>
    get<{ success: boolean; order: BackendOrder }>(`/api/orders/${id}`),

  cancel: (id: string) =>
    put<{ success: boolean; order: BackendOrder }>(`/api/orders/${id}/cancel`, {}),
};

/* ═══════════════════════════════════════════════════════
   WISHLIST (requires auth)
═══════════════════════════════════════════════════════ */

export const wishlist = {
  get: () =>
    get<{ success: boolean; wishlist: { products: BackendProduct[] } }>("/api/wishlist"),

  toggle: (productId: string) =>
    post<{ success: boolean; added: boolean }>("/api/wishlist/toggle", { productId }),

  remove: (productId: string) =>
    del(`/api/wishlist/${productId}`),
};

/* ═══════════════════════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════════════════════ */

export const newsletter = {
  subscribe: (email: string, name?: string) =>
    post<{ success: boolean; message: string }>("/api/newsletter/subscribe", { email, name }),

  unsubscribe: (email: string) =>
    post<{ success: boolean }>("/api/newsletter/unsubscribe", { email }),
};

/* util export */
export { getToken, clearToken };
