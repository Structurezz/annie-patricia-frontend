import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import About from "./pages/about";
import Contact from "./pages/contact";
import Shop from "./pages/shop";
import ProductDetail from "./components/ProductDetail";
import Saved from "./pages/saved"; 
import Cart from "./pages/cart";
import CheckOut from "./pages/checkout";
import Orders from "./pages/order";
import OrderDetail from "./components/OrderDetail";
import Shipping from "./pages/shipping";



function App() {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  return (
    <Routes>
      <Route
        path="/"
        element={<Home wishlist={wishlist} setWishlist={setWishlist} />}
        
      />
      <Route
        path="/category"
        element={<Shop wishlist={wishlist} setWishlist={setWishlist} />}
      />
      <Route
        path="/category/:categoryName"
        element={<Shop wishlist={wishlist} setWishlist={setWishlist} />}
      />
      <Route
        path="/product/:id"
        element={<ProductDetail />} // ← Product Detail Route
      />
    
      <Route
          path="/about"
          element={<About wishlist={wishlist} setWishlist={setWishlist} />}
        />
        <Route
          path="/contact"
          element={<Contact wishlist={wishlist} setWishlist={setWishlist} />}
        />

<Route path="/saved" element={<Saved />} />
<Route path="/cart" element={<Cart />} />
<Route path="/checkout" element={<CheckOut />} />
<Route path="/orders" element={<Orders />} />
<Route path="/order/:id" element={<OrderDetail />} />
<Route path="/shipping" element={<Shipping />} />


    </Routes>
  );
}

export default App;
