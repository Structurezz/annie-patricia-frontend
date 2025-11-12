// src/pages/About.tsx
import React from "react";
import { motion } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

interface AboutProps {
  wishlist: Set<number>;
  setWishlist: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const About: React.FC<AboutProps> = ({ wishlist, setWishlist }) => {
  const cartCount = 3;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Topbar wishlistCount={wishlist.size} cartCount={cartCount} />

      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src="https://media.istockphoto.com/id/2235881073/photo/smile-laughing-and-portrait-of-woman-in-studio-for-fashion-designer-about-us-and-clothes.jpg?s=612x612&w=0&k=20&c=guJ38zceR5gxFBmXgRuw0MqIZxDso72JBrVMR8shRmM="
            alt="Our Lagos atelier"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="absolute inset-0 flex items-end pb-24 px-8 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-light text-white tracking-tight">
              OUR STORY
            </h1>
            <p className="text-xl text-white/90 mt-4 font-light">
              Lagos-born. Globally crafted.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-light tracking-tight"
          >
            Quiet Luxury, Loud Intent
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Founded in 2020 by Annie Patricia in Lagos, Nigeria — we create timeless wardrobe
            essentials using the world&apos;s finest materials. Every piece is designed
            with intention: minimal in aesthetic, maximal in quality.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-stone-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          {[
            {
              num: "01",
              title: "Heritage Materials",
              desc: "Mongolian cashmere, Italian silk, Japanese denim, Belgian linen",
            },
            {
              num: "02",
              title: "Ethical Production",
              desc: "Small batches of 30–100 pieces. Zero overproduction.",
            },
            {
              num: "03",
              title: "Carbon Neutral",
              desc: "100% offset shipping & operations since 2020.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <span className="text-7xl font-light text-gray-200 block mb-4">
                {item.num}
              </span>
              <h3 className="text-2xl font-medium mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;