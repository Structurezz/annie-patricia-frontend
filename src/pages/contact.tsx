// src/pages/Contact.tsx
import React from "react";
import { motion } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";

interface ContactProps {
  wishlist: Set<number>;
  setWishlist: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const Contact: React.FC<ContactProps> = ({ wishlist, setWishlist }) => {
  const cartCount = 3;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Topbar wishlistCount={wishlist.size} cartCount={cartCount} />

      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&h=1000&fit=crop&auto=format&q=85"
            alt="Lagos flagship store"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-6xl md:text-8xl font-light text-white tracking-tight"
          >
            VISIT US
          </motion.h1>
        </div>
      </section>

      {/* Stores */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
          {/* Lagos */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[4/3] mb-8 overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
                alt="Lagos store"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-3xl font-medium mb-6">LAGOS</h3>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>
                  12A Awolowo Road<br />
                  Ikoyi, Lagos<br />
                  Nigeria
                </span>
              </p>
              <p className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5" />
                <a href="tel:+2349091234567">+234 909 123 4567</a>
              </p>
              <p className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5" />
                <a href="mailto:lagos@yourbrand.com">lagos@yourbrand.com</a>
              </p>
              <p className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 mt-1" />
                <span>
                  Mon–Sat: 10AM–7PM<br />
                  Sun: 12PM–6PM
                </span>
              </p>
            </div>
          </motion.div>

          {/* London */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="aspect-[4/3] mb-8 overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop"
                alt="London store"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-3xl font-medium mb-6">LONDON</h3>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>
                  45 Mount Street<br />
                  Mayfair, London W1K 2RZ<br />
                  United Kingdom
                </span>
              </p>
              <p className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5" />
                <a href="tel:+442012345678">+44 20 1234 5678</a>
              </p>
              <p className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5" />
                <a href="mailto:london@yourbrand.com">london@yourbrand.com</a>
              </p>
              <p className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 mt-1" />
                <span>
                  Mon–Sat: 11AM–7PM<br />
                  Sun: Closed
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white p-12 shadow-sm"
        >
          <h3 className="text-3xl font-medium text-center mb-10">Get in Touch</h3>
          <form className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <input
                type="text"
                placeholder="First Name"
                className="border-b border-gray-300 px-2 py-4 focus:border-black outline-none transition text-lg"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border-b border-gray-300 px-2 py-4 focus:border-black outline-none transition text-lg"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border-b border-gray-300 px-2 py-4 focus:border-black outline-none transition text-lg"
            />
            <textarea
              rows={5}
              placeholder="Your Message"
              className="w-full border-b border-gray-300 px-2 py-4 focus:border-black outline-none transition resize-none text-lg"
            />
            <div className="text-center pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-black text-white px-16 py-5 font-medium tracking-wider hover:bg-gray-800 transition text-lg"
              >
                SEND MESSAGE
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;