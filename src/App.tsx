import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchProfile, setUser } from "./store/authSlice";
import { getToken } from "./services/api";

// Homepages
import Home        from "./pages/homepage";
import WomenHome   from "./pages/women-home";
import MenHome     from "./pages/men-home";

// Shops
import Shop        from "./pages/shop";
import WomenShop   from "./pages/women-shop";
import MenShop     from "./pages/men-shop";

// Curated pages
import NewArrivals from "./pages/new-arrivals";
import Bestsellers from "./pages/bestsellers";

// Content
import About       from "./pages/about";
import Contact     from "./pages/contact";

// Commerce
import ProductDetail from "./components/ProductDetail";
import Cart          from "./pages/cart";
import CheckOut      from "./pages/checkout";
import Orders        from "./pages/order";
import OrderDetail   from "./components/OrderDetail";
import Saved         from "./pages/saved";
import Shipping      from "./pages/shipping";

// Auth
import Login    from "./pages/login";
import Register from "./pages/register";

function App() {
  const dispatch    = useAppDispatch();
  const initialized = useAppSelector(s => s.auth.initialized);

  /* Restore session on mount if token exists */
  useEffect(() => {
    if (getToken()) dispatch(fetchProfile());
    else dispatch(setUser(null));
  }, [dispatch]);

  return (
    <Routes>
      {/* ── Landing ── */}
      <Route path="/"            element={<Home />} />

      {/* ── Women ── */}
      <Route path="/women"       element={<WomenHome />} />
      <Route path="/women/shop"  element={<WomenShop />} />

      {/* ── Men ── */}
      <Route path="/men"         element={<MenHome />} />
      <Route path="/men/shop"    element={<MenShop />} />

      {/* ── General shop ── */}
      <Route path="/category"              element={<Shop />} />
      <Route path="/category/:categoryName" element={<Shop />} />

      {/* ── Curated ── */}
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/bestsellers"  element={<Bestsellers />} />

      {/* ── Product ── */}
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* ── Content ── */}
      <Route path="/about"   element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ── Commerce ── */}
      <Route path="/cart"       element={<Cart />} />
      <Route path="/checkout"   element={<CheckOut />} />
      <Route path="/orders"     element={<Orders />} />
      <Route path="/order/:id"  element={<OrderDetail />} />
      <Route path="/saved"      element={<Saved />} />
      <Route path="/shipping"   element={<Shipping />} />

      {/* ── Auth ── */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account"  element={<Login />} />
    </Routes>
  );
}

export default App;
