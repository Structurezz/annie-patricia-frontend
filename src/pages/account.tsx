"use client";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logoutUser, fetchProfile } from "../store/authSlice";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

export default function Account() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, initialized } = useAppSelector((state) => state.auth);

  // Fetch profile if needed
  useEffect(() => {
    if (initialized && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, initialized, user]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (initialized && !user) {
      navigate("/login", { 
        replace: true,
        state: { from: { pathname: "/account" } }
      });
    }
  }, [user, initialized, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/", { replace: true });
  };

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <Topbar />
        <p className="text-[#7A7571]">Loading your account...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Topbar />

      <div className="max-w-2xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="mb-12 text-center">
            <p className="text-[10px] tracking-[0.4em] text-[#C9A84C] font-inter uppercase mb-3">
              MY ACCOUNT
            </p>
            <h1 className="font-cormorant text-5xl font-light text-[#0A0908]">
              Welcome back, {user.firstName || "Client"}
            </h1>
          </div>

          {/* Account Details Card */}
          <div className="bg-white border border-[#E0DBD4] p-10 mb-10">
            <h2 className="font-inter uppercase text-xs tracking-[0.2em] text-[#7A7571] mb-8">
              Account Information
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs tracking-widest text-[#7A7571] mb-1">FIRST NAME</p>
                  <p className="text-[#0A0908] text-lg font-light">
                    {user.firstName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest text-[#7A7571] mb-1">LAST NAME</p>
                  <p className="text-[#0A0908] text-lg font-light">
                    {user.lastName || "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs tracking-widest text-[#7A7571] mb-1">EMAIL ADDRESS</p>
                <p className="text-[#0A0908] text-lg font-light">{user.email}</p>
              </div>

              {user.phone && (
                <div>
                  <p className="text-xs tracking-widest text-[#7A7571] mb-1">PHONE NUMBER</p>
                  <p className="text-[#0A0908] text-lg font-light">{user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="w-full py-4 border border-[#0A0908] text-[#0A0908] font-inter text-sm tracking-widest hover:bg-[#0A0908] hover:text-white transition-all"
            >
              VIEW MY ORDERS
            </button>

            <button
              onClick={() => navigate("/saved")}
              className="w-full py-4 border border-[#0A0908] text-[#0A0908] font-inter text-sm tracking-widest hover:bg-[#0A0908] hover:text-white transition-all"
            >
              MY WISHLIST
            </button>

            <button
              onClick={() => navigate("/account/edit")}
              className="w-full py-4 border border-[#0A0908] text-[#0A0908] font-inter text-sm tracking-widest hover:bg-[#0A0908] hover:text-white transition-all"
            >
              EDIT PROFILE
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-4 mt-6 text-red-600 font-inter text-sm tracking-widest hover:bg-red-50 transition-all"
            >
              SIGN OUT
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}