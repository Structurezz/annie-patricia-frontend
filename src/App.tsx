import React from "react";
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
import NewArrivals from "./pages/new-arrivals";
import Bestsellers from "./pages/bestsellers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category" element={<Shop />} />
      <Route path="/category/:categoryName" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/bestsellers" element={<Bestsellers />} />
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
