"use client";

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, clearError } from "../store/authSlice";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Default to home "/" after login
  // If user came from a protected route, redirect back there
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(loginUser({ email, password }));

    // Check if login was successful
    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
    // If rejected, the error is already handled by Redux + displayed below
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Topbar />

      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Left image panel — desktop only */}
        <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#0A0908]">
          <img
            src="https://media.istockphoto.com/id/2244091688/photo/african-woman-successful-small-business-owner-in-ankara-print-dress-stands-proudly-in-her.jpg?s=612x612&w=0&k=20&c=TfXx7fh2FTGR8ADdfMMhGWF7IyZyjCbNMNePg69Qbdc="
            alt="Luxury fashion"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/80 to-transparent" />
          <div className="absolute bottom-16 left-12 right-12">
            <p className="font-cormorant text-5xl font-light text-white leading-tight mb-4">
              Dress for the<br />
              <em className="italic text-[#C9A84C]">life you deserve.</em>
            </p>
            <p className="text-white/40 text-sm font-inter">Annie Patricia — Lagos Luxury</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <p className="text-[10px] tracking-[0.4em] text-[#C9A84C] font-inter uppercase mb-2">
                Welcome back
              </p>
              <h1 className="font-cormorant text-4xl font-light text-[#0A0908]">
                Sign In
              </h1>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-xs font-inter rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#7A7571] font-inter uppercase mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-[#E0DBD4] bg-white px-4 py-3 text-sm font-inter text-[#0A0908] placeholder-[#C9C4BC] focus:outline-none focus:border-[#0A0908] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#7A7571] font-inter uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-[#E0DBD4] bg-white px-4 py-3 text-sm font-inter text-[#0A0908] placeholder-[#C9C4BC] focus:outline-none focus:border-[#0A0908] transition-colors pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-inter tracking-wider text-[#7A7571] hover:text-[#0A0908] transition-colors"
                  >
                    {showPwd ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-inter text-[#7A7571] hover:text-[#0A0908] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0A0908] text-black text-[11px] font-inter font-medium tracking-[0.2em] hover:bg-[#C9A84C] hover:text-[#0A0908] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "SIGNING IN…" : "SIGN IN"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-inter text-[#7A7571]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#0A0908] font-medium hover:text-[#C9A84C] transition-colors"
              >
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}