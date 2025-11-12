"use client";

import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <TopBar wishlistCount={wishlistCount} cartCount={0} />
        <main className="flex-1 flex items-center justify-center px-6 text-center">
          <div>
            <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/category"
              className="inline-block px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <TopBar wishlistCount={wishlistCount} cartCount={cartCount} />

      <main className="flex-1 py-12 pt-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light mb-10 text-center tracking-tight">
            Your Cart
          </h1>

          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-lg shadow-sm hover:shadow transition"
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-32 h-40 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="block">
                    <h3 className="font-medium text-lg line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.designer}</p>
                  </Link>

                  <div className="flex items-center gap-3 mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          )
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <p className="ml-auto font-medium text-lg">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-600 text-sm mt-3 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total + Checkout */}
          <div className="mt-12 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-2xl font-medium">Total</p>
              <p className="text-2xl font-medium">₦{total.toLocaleString()}</p>
            </div>

            <div className="text-center">
              <Link to="/checkout">
                <button className="w-full sm:w-auto px-12 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition tracking-wider">
                  PROCEED TO CHECKOUT
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;