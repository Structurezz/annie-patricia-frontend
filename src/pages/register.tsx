"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser, clearError } from "../store/authSlice";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(s => s.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [agree,     setAgree]     = useState(false);
  const [localErr,  setLocalErr]  = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr("");
    dispatch(clearError());
    if (password !== confirm) { setLocalErr("Passwords do not match."); return; }
    if (password.length < 8)  { setLocalErr("Password must be at least 8 characters."); return; }
    const result = await dispatch(registerUser({ firstName, lastName, email, password }));
    if (registerUser.fulfilled.match(result)) navigate("/");
  };

  const displayErr = localErr || error;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Topbar />
      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Left image */}
        <div className="hidden lg:block flex-1 relative overflow-hidden bg-[#0A0908]">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80"
            alt=""
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/70 to-transparent" />
          <div className="absolute bottom-16 left-12 right-12">
            <p className="font-cormorant text-5xl font-light text-white leading-tight mb-4">
              Your style,<br /><em className="italic text-[#C9A84C]">your story.</em>
            </p>
            <p className="text-white/40 text-sm font-inter">Join thousands of Annie Patricia customers</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-10">
              <p className="text-[10px] tracking-[0.4em] text-[#C9A84C] font-inter uppercase mb-2">Join us</p>
              <h1 className="font-cormorant text-4xl font-light text-[#0A0908]">Create Account</h1>
            </div>

            {displayErr && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-xs font-inter">
                {displayErr}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#7A7571] font-inter uppercase mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="w-full border border-[#E0DBD4] bg-white px-4 py-3 text-sm font-inter text-[#0A0908] placeholder-[#C9C4BC] focus:outline-none focus:border-[#0A0908] transition-colors"
                    placeholder="Chioma"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#7A7571] font-inter uppercase mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="w-full border border-[#E0DBD4] bg-white px-4 py-3 text-sm font-inter text-[#0A0908] placeholder-[#C9C4BC] focus:outline-none focus:border-[#0A0908] transition-colors"
                    placeholder="Okeke"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#7A7571] font-inter uppercase mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full border border-[#E0DBD4] bg-white px-4 py-3 text-sm font-inter text-[#0A0908] placeholder-[#C9C4BC] focus:outline-none focus:border-[#0A0908] transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#7A7571] font-inter uppercase mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full border border-[#E0DBD4] bg-white px-4 py-3 text-sm font-inter text-[#0A0908] placeholder-[#C9C4BC] focus:outline-none focus:border-[#0A0908] transition-colors"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#7A7571] font-inter uppercase mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className="w-full border border-[#E0DBD4] bg-white px-4 py-3 text-sm font-inter text-[#0A0908] placeholder-[#C9C4BC] focus:outline-none focus:border-[#0A0908] transition-colors"
                  placeholder="Repeat password"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 accent-[#C9A84C] cursor-pointer"
                />
                <span className="text-xs font-inter text-[#7A7571] leading-relaxed">
                  I agree to Annie Patricia's{" "}
                  <Link to="/privacy" className="text-[#0A0908] underline underline-offset-2">Privacy Policy</Link>{" "}
                  and{" "}
                  <Link to="/terms" className="text-[#0A0908] underline underline-offset-2">Terms of Service</Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agree}
                className="w-full py-3.5 bg-[#0A0908] text-black text-[11px] font-inter font-medium tracking-[0.2em] hover:bg-[#C9A84C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-inter text-[#7A7571]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0A0908] font-medium hover:text-[#C9A84C] transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
