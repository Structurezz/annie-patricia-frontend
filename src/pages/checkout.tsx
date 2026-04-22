"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
} from "@heroicons/react/24/outline";
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from "react-icons/si";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { 
  removeFromCartServer, 
  updateQuantityServer, 
  clearCart 
} from "../store/cartSlice";

// Service Imports
import { auth, orders, cart, Address, CreateOrderPayload } from "../services/api";

type Step = 1 | 2 | 3 | 4 | 5;

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "_id">>({
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

  // Fetch Addresses using the profile service
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await auth.getProfile();
        if (response.success && response.user.addresses) {
          setSavedAddresses(response.user.addresses);
          const def = response.user.addresses.find(a => a.isDefault) || response.user.addresses[0];
          setSelectedAddress(def || null);
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  // Cart calculations
  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  const handleQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
  
    const qty = item.quantity + delta;
  
    try {
      if (qty <= 0) {
        await dispatch(removeFromCartServer(id)).unwrap();
      } else {
        await dispatch(
          updateQuantityServer({
            itemId: id,
            quantity: qty,
          })
        ).unwrap();
      }
    } catch (err) {
      console.error("Cart update failed:", err);
    }
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) handlePayment();
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }
    
    setLoading(true);
    try {
      // 1. Get the current user profile safely for the email
      const profileRes = await auth.getProfile();
      const userEmail = profileRes.success ? profileRes.user.email : "";
  
      // 2. Safely split the recipient name
      const nameParts = (selectedAddress.recipient || "Guest Customer").trim().split(/\s+/);
      const firstName = nameParts[0] || "Customer";
      const lastName = nameParts.slice(1).join(" ") || "User";
  
      // 3. Construct the payload exactly how your backend expects it
      const payload: any = {
        items: cartItems.map(item => ({
          product: String(item.id),
          quantity: item.quantity,
          size: (item as any).size || "Standard"
        })),
        shippingAddress: {
          firstName: firstName,
          lastName: lastName,
          email: userEmail, // Required by your backend for Paystack
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          phone: selectedAddress.phone
        },
        shippingMethod: "standard",
        paymentMethod: paymentMethod === "card" ? "paystack" : "bank",
        notes: ""
      };
  
      const response = await orders.create(payload);
      
      if (response.success) {
        // Handle Paystack redirect
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
          return;
        }
  
        // Handle Bank Transfer / Success
        setOrderId(response.data?.orderNumber || "SUCCESS");
        dispatch(clearCart());
        await cart.clear().catch(() => null);
        setShowSuccess(true);
        setStep(5);
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      // If you see "Cart is empty" here, you must ensure you called 
      // cart.add() on the product page so the items are in the DB.
      alert(error.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const response = await auth.addAddress(newAddress);
      // Re-fetch profile to get updated list with IDs
      const profileRes = await auth.getProfile();
      if (profileRes.success && profileRes.user.addresses) {
        setSavedAddresses(profileRes.user.addresses);
        setSelectedAddress(profileRes.user.addresses[profileRes.user.addresses.length - 1]);
      }
      setShowAddressForm(false);
      setNewAddress({ recipient: "", street: "", city: "", state: "", postalCode: "", phone: "" });
    } catch (e) {
      alert("Failed to save address");
    }
  };

  const formatCardNumber = (v: string) => v.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => v.replace(/^(\d{2})(\d{0,2})$/, "$1/$2").slice(0, 5);

  const isAddressValid = selectedAddress !== null;
  const isCardValid = card.number.length >= 16 && card.expiry.length === 5 && card.cvv.length >= 3 && card.name;

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
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="grid gap-6 lg:gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-5">
                  {cartItems.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm flex gap-3 relative group">
                      <button onClick={() => dispatch(removeFromCartServer(item.id))}className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                        <XMarkIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="w-20 h-28 sm:w-28 sm:h-36 bg-gray-100 rounded overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base sm:text-lg line-clamp-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{item.designer}</p>
                        <div className="flex items-center gap-2 mt-2 sm:mt-3">
                          <div className="flex items-center border rounded-md text-sm">
                            <button onClick={() => handleQuantity(item.id, -1)} className="p-1.5 hover:bg-gray-100"><MinusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                            <span className="px-2 sm:px-3 font-medium">{item.quantity}</span>
                            <button onClick={() => handleQuantity(item.id, 1)} className="p-1.5 hover:bg-gray-100"><PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                          </div>
                          <p className="ml-auto font-medium text-sm sm:text-base">₦{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sticky top-24">
                    <h2 className="text-lg sm:text-xl font-medium mb-4">Order Summary</h2>
                    <div className="space-y-2 sm:space-y-3 text-sm">
                      <div className="flex justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="flex items-center gap-1"><TruckIcon className="w-4 h-4" />Shipping</span><span>{shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}</span></div>
                      <div className="border-t pt-2 sm:pt-3 flex justify-between font-medium text-base sm:text-lg"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
                    </div>
                    <button onClick={handleNext} className="w-full mt-5 sm:mt-6 bg-black text-white py-2.5 sm:py-3 rounded-md font-medium hover:bg-gray-800 transition text-sm sm:text-base">Continue to Address</button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-medium mb-5 sm:mb-6 text-center flex items-center justify-center gap-2"><MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6" />Shipping Address</h2>
                <div className="space-y-3 sm:space-y-4">
                  {savedAddresses.map((addr) => (
                    <label key={addr._id} className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${selectedAddress?._id === addr._id ? "border-black bg-gray-50" : ""}`}>
                      <input type="radio" name="address" checked={selectedAddress?._id === addr._id} onChange={() => setSelectedAddress(addr)} className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-black" />
                      <div className="flex-1">
                        <p className="font-medium flex items-center gap-2 text-sm sm:text-base">{addr.recipient}{addr.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span>}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <button onClick={() => setShowAddressForm(true)} className="w-full p-4 sm:p-5 border border-dashed rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm sm:text-base"><PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />Add New Address</button>
                </div>

                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-3 sm:space-y-4 overflow-hidden">
                      <input type="text" placeholder="Recipient Full Name" value={newAddress.recipient} onChange={(e) => setNewAddress({ ...newAddress, recipient: e.target.value })} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base" />
                      <input type="text" placeholder="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md text-sm sm:text-base" />
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="border rounded-md px-3 py-2" />
                        <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="border rounded-md px-3 py-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className="border rounded-md px-3 py-2" />
                        <input type="text" placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className="border rounded-md px-3 py-2" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleSaveAddress} className="flex-1 bg-black text-white py-2 rounded-md">Save</button>
                        <button onClick={() => setShowAddressForm(false)} className="flex-1 border py-2 rounded-md">Cancel</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex gap-3 mt-8 justify-center">
                  <button onClick={() => setStep(1)} className="px-8 py-3 border rounded-md">Back</button>
                  <button onClick={handleNext} disabled={!isAddressValid} className="px-8 py-3 bg-black text-white rounded-md disabled:opacity-50">Continue to Payment</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="max-w-2xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl font-medium mb-6">Choose Payment Method</h2>
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-5 border rounded-lg cursor-pointer ${paymentMethod === "card" ? "border-black bg-gray-50" : ""}`}>
                    <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="w-5 h-5 text-black" />
                    <div className="flex-1 text-left"><p className="font-medium flex items-center gap-2"><CreditCardIcon className="w-5 h-5" />Pay with Card</p>
                      <div className="flex gap-2 mt-2 text-xl"><SiVisa className="text-blue-600" /><SiMastercard className="text-orange-600" /><SiApplepay /><SiGooglepay /></div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-5 border rounded-lg cursor-pointer ${paymentMethod === "bank" ? "border-black bg-gray-50" : ""}`}>
                    <input type="radio" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} className="w-5 h-5 text-black" />
                    <div className="flex-1 text-left"><p className="font-medium flex items-center gap-2"><BanknotesIcon className="w-5 h-5" />Bank Transfer</p></div>
                  </label>
                </div>
                <div className="flex gap-3 mt-8 justify-center">
                  <button onClick={() => setStep(2)} className="px-8 py-3 border rounded-md font-medium">Back</button>
                  <button onClick={handleNext} className="px-8 py-3 bg-black text-white rounded-md font-medium">Review Order</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-medium mb-6 text-center">Review & Pay</h2>
                <div className="bg-white p-5 rounded-lg shadow-sm mb-6 space-y-4">
                  <div className="flex items-start gap-3"><MapPinIcon className="w-5 h-5 mt-1" />
                    <div><p className="font-medium">Shipping to: {selectedAddress?.recipient}</p>
                      <p className="text-sm text-gray-600">{selectedAddress?.street}, {selectedAddress?.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3"><CreditCardIcon className="w-5 h-5" />
                    <p className="font-medium">{paymentMethod === "card" ? "Card Payment" : "Bank Transfer"}</p>
                  </div>
                </div>
                <div className="bg-gray-100 p-5 rounded-lg mb-6 text-center">
                  <p className="text-2xl font-medium">Total: ₦{total.toLocaleString()}</p>
                </div>
                {paymentMethod === "card" && (
                  <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
                    <input type="text" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value.slice(0, 19)) })} placeholder="Card Number" className="w-full px-4 py-3 border rounded-md" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" className="w-full px-4 py-3 border rounded-md" />
                      <input type="text" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.slice(0, 4) })} placeholder="CVV" className="w-full px-4 py-3 border rounded-md" />
                    </div>
                    <input type="text" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="Cardholder Name" className="w-full px-4 py-3 border rounded-md" />
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setStep(3)} className="px-8 py-3 border rounded-md font-medium">Back</button>
                  <button onClick={handlePayment} disabled={loading || (paymentMethod === "card" && !isCardValid)} className="px-8 py-3 bg-black text-white rounded-md font-medium flex items-center gap-2">
                    {loading ? "Processing..." : <><ShieldCheckIcon className="w-5 h-5" />Pay Now</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuccess && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-8 text-center max-w-sm w-full">
                  <CheckCircleIcon className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-2xl font-medium mb-2">Success!</h3>
                  <p className="text-gray-600 mb-6">Order <span className="font-mono font-bold">{orderId}</span> confirmed.</p>
                  <button onClick={() => navigate('/orders')} className="w-full bg-black text-white py-3 rounded-md">View Orders</button>
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