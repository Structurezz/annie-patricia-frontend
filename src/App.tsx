import React from "react";
import { Routes, Route } from "react-router-dom";

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

function App() {
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

      {/* ── General shop (legacy /category routes) ── */}
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
    </Routes>
  );
}

export default App;
