// src/pages/Checkout.tsx
"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  CheckCircleIcon,
  BanknotesIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from "react-icons/si";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { allProducts } from "../components/data/products";

// ── Mock Saved Addresses (in real app: from Redux or API) ──
const mockSavedAddresses = [
  {
    id: 1,
    name: "Home",
    recipient: "Chioma Okeke",
    street: "12 Adeola Odeku Street",
    city: "Lagos",
    state: "Lagos",
    postalCode: "100001",
    phone: "08012345678",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    recipient: "Chioma Okeke",
    street: "Plot 5, Silicon Valley",
    city: "Abuja",
    state: "FCT",
    postalCode: "900001",
    phone: "09087654321",
    isDefault: false,
  },
];
type Step = 1 | 2 | 3 | 4 | 5;
interface Address {
  id?: number;
  name: string;
  recipient: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}
export default function Checkout() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId] = useState(() => `ORD-${Date.now().toString(36).toUpperCase()}`);
  // Address state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(mockSavedAddresses[0]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    name: "",
    recipient: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  // Card state
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  // Cart calculations
  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;
  // Handlers
  const handleQuantity = (id: number, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    const qty = item.quantity + delta;
    if (qty <= 0) dispatch(removeFromCart(id));
    else dispatch(updateQuantity({ id, quantity: qty }));
  };
  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) handlePayment();
  };
  const handlePayment = () => {
    setTimeout(() => {
      dispatch(clearCart());
      setShowSuccess(true);
      setStep(5);
    }, 1500);
  };
  const formatCardNumber = (v: string) => v.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => v.replace(/^(\d{2})(\d{0,2})$/, "$1/$2").slice(0, 5);
  // Validation
  const isAddressValid = selectedAddress !== null;
  const isCardValid = card.number && card.expiry && card.cvv && card.name;
  if (cartItems.length === 0 && step < 5) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Topbar wishlistCount={wishlistCount} cartCount={0} />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gray-200 border-2 border-dashed rounded-xl mb-4" />
            <h2 className="text-xl sm:text-2xl font-light mb-2">Your cart is empty</h2>
            <Link to="/category" className="inline-block mt-4 px-6 py-2.5 sm:px-8 sm:py-3 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm sm:text-base">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar
        wishlistCount={wishlistCount}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
      />
      <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Step Indicator */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition ${
                    step >= s ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 ${step > s ? "bg-black" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {/* STEP 1: Review Cart */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="grid gap-6 lg:gap-10 lg:grid-cols-3"
              >
                <div className="lg:col-span-2 space-y-5">
                  {cartItems.map((item, i) => {
                    const p = allProducts.find((x) => x.id === item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-3 sm:p-4 rounded-lg shadow-sm flex gap-3 relative group"
                      >
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                        >
                          <XMarkIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <Link to={`/product/${item.id}`} className="flex-shrink-0">
                          <div className="w-20 h-28 sm:w-28 sm:h-36 bg-gray-100 rounded overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.id}`} className="block">
                            <h3 className="font-medium text-base sm:text-lg line-clamp-1">{item.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">{p?.designer}</p>
                          </Link>
                          <div className="flex items-center gap-2 mt-2 sm:mt-3">
                            <div className="flex items-center border rounded-md text-sm">
                              <button onClick={() => handleQuantity(item.id, -1)} className="p-1.5 hover:bg-gray-100">
                                <MinusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <span className="px-2 sm:px-3 font-medium">{item.quantity}</span>
                              <button onClick={() => handleQuantity(item.id, 1)} className="p-1.5 hover:bg-gray-100">
                                <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <p className="ml-auto font-medium text-sm sm:text-base">₦{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sticky top-24">
                    <h2 className="text-lg sm:text-xl font-medium mb-4">Order Summary</h2>
                    <div className="space-y-2 sm:space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₦{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <TruckIcon className="w-4 h-4" />
                          Shipping
                        </span>
                        <span>{shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}</span>
                      </div>
                      {shipping === 0 && <p className="text-xs text-green-600">Free shipping!</p>}
                      <div className="border-t pt-2 sm:pt-3 flex justify-between font-medium text-base sm:text-lg">
                        <span>Total</span>
                        <span>₦{total.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full mt-5 sm:mt-6 bg-black text-white py-2.5 sm:py-3 rounded-md font-medium hover:bg-gray-800 transition text-sm sm:text-base"
                    >
                      Continue to Address
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {/* STEP 2: Shipping Address */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-center flex items-center justify-center gap-2">
                  <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  Shipping Address
                </h2>
                {/* Saved Addresses */}
                <div className="space-y-3 sm:space-y-4">
                  {mockSavedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                        selectedAddress?.id === addr.id ? "border-black" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-black"
                      />
                      <div className="flex-1">
                        <p className="font-medium flex items-center gap-2 text-sm sm:text-base">
                          {addr.name}
                          {addr.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span>}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {addr.recipient} • {addr.phone}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                      </div>
                    </label>
                  ))}
                  {/* Add New */}
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full p-4 sm:p-5 border border-dashed rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add New Address
                  </button>
                </div>
                {/* New Address Form */}
                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-3 sm:space-y-4"
                    >
                      <input
                        type="text"
                        placeholder="Address Name (e.g., Home)"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base"
                      />
                      <input
                        type="text"
                        placeholder="Recipient Full Name"
                        value={newAddress.recipient}
                        onChange={(e) => setNewAddress({ ...newAddress, recipient: e.target.value })}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base"
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base"
                        />
                        <select
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base"
                        >
                          <option value="">State</option>
                          <option value="Lagos">Lagos</option>
                          <option value="Abuja">Abuja</option>
                          <option value="Rivers">Rivers</option>
                          <option value="Kano">Kano</option>
                          {/* Add more */}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value.slice(0, 6) })}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.slice(0, 11) })}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base"
                        />
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() => {
                            setSelectedAddress({ ...newAddress, id: Date.now() });
                            setShowAddressForm(false);
                            setNewAddress({
                              name: "",
                              recipient: "",
                              street: "",
                              city: "",
                              state: "",
                              postalCode: "",
                              phone: "",
                            });
                          }}
                          className="flex-1 bg-black text-white py-2.5 sm:py-3 rounded-md font-medium hover:bg-gray-800 text-sm sm:text-base"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="flex-1 border py-2.5 sm:py-3 rounded-md font-medium hover:bg-gray-100 text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 justify-center">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 border rounded-md font-medium hover:bg-gray-100 text-sm sm:text-base"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isAddressValid}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}
            {/* STEP 3: Payment Method */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-center">Choose Payment Method</h2>
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="method"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-black"
                    />
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2 text-sm sm:text-base">
                        <CreditCardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        Pay with Card
                      </p>
                      <div className="flex gap-2 mt-1.5 sm:mt-2 text-lg sm:text-xl">
                        <SiVisa className="text-blue-600" />
                        <SiMastercard className="text-orange-600" />
                        <SiApplepay className="text-black" />
                        <SiGooglepay className="text-blue-500" />
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="method"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-black"
                    />
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2 text-sm sm:text-base">
                        <BanknotesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        Bank Transfer
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Pay to our Nigerian account</p>
                    </div>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 justify-center">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 border rounded-md font-medium hover:bg-gray-100 text-sm sm:text-base"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 text-sm sm:text-base"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}
            {/* STEP 4: Confirm & Pay */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-center">Review & Pay</h2>
                {/* Address Summary */}
                {selectedAddress && (
                  <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm mb-5 sm:mb-6">
                    <p className="font-medium flex items-center gap-2 mb-1.5 sm:mb-2 text-sm sm:text-base">
                      <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Shipping to: {selectedAddress.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {selectedAddress.recipient} • {selectedAddress.phone}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                    </p>
                  </div>
                )}
                {/* Payment Summary */}
                <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm mb-5 sm:mb-6">
                  <p className="font-medium flex items-center gap-2 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    <CreditCardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {paymentMethod === "card" ? "Card Payment" : "Bank Transfer"}
                  </p>
                  {paymentMethod === "card" ? (
                    <p className="text-xs sm:text-sm text-gray-600">•••• •••• •••• {card.number.slice(-4)}</p>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-600">Transfer to GTBank: 0123456789</p>
                  )}
                </div>
                {/* Total */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg mb-5 sm:mb-6 text-center">
                  <p className="text-xl sm:text-2xl font-medium">Total: ₦{total.toLocaleString()}</p>
                  {shipping === 0 && <p className="text-xs sm:text-sm text-green-600">Free shipping applied!</p>}
                </div>
                {paymentMethod === "card" && (
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-4 sm:space-y-5 mb-5 sm:mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Card Number</label>
                      <input
                        type="text"
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value.slice(0, 19)) })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md focus:ring-2 focus:ring-black text-sm sm:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 sm:mb-2">Expiry</label>
                        <input
                          type="text"
                          value={card.expiry}
                          onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md focus:ring-2 focus:ring-black text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 sm:mb-2">CVV</label>
                        <input
                          type="text"
                          value={card.cvv}
                          onChange={(e) => setCard({ ...card, cvv: e.target.value.slice(0, 4) })}
                          placeholder="123"
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md focus:ring-2 focus:ring-black text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 sm:mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md focus:ring-2 focus:ring-black text-sm sm:text-base"
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 border rounded-md font-medium hover:bg-gray-100 text-sm sm:text-base"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={paymentMethod === "card" && !isCardValid}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {paymentMethod === "card" ? "Pay Now" : "I’ve Paid"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* SUCCESS MODAL */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowSuccess(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CheckCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-green-600 mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-medium mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    Order <span className="font-mono font-bold">{orderId}</span> confirmed.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
                    Shipping to: {selectedAddress?.city}, {selectedAddress?.state}
                  </p>
                  <Link
                    to="/category"
                    className="inline-block w-full px-6 py-2.5 sm:px-8 sm:py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 text-sm sm:text-base"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}