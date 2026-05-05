import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Shield, TrendingUp, Zap } from 'lucide-react';

export const MotionLanding: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative min-h-screen bg-premium-bg overflow-hidden text-premium-text font-sans selection:bg-premium-gold selection:text-premium-bg">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-premium-gold/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-premium-goldDim/5 blur-[100px]" />
      </div>

      {/* Floating Glass Shapes */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0], 
          rotate: [0, 5, -5, 0],
          x: [0, 10, -10, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] w-64 h-64 border border-premium-gold/20 bg-premium-surface/30 backdrop-blur-md rounded-2xl z-0 hidden lg:block shadow-goldGlow"
        style={{ transform: "rotate(15deg) skewX(-10deg)" }}
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0], 
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[10%] left-[10%] w-48 h-48 border border-white/5 bg-premium-surface/20 backdrop-blur-xl rounded-full z-0 hidden md:block"
      />

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl font-serif font-bold tracking-wider text-premium-gold"
        >
          SENTINEL
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <button onClick={onEnter} className="text-sm font-semibold tracking-widest uppercase hover:text-premium-gold transition-colors duration-300">
            Access Portal
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <motion.div style={{ opacity: opacityText, y: yBg }} className="max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-premium-goldMuted border border-premium-gold/30 mb-8"
          >
            <Shield className="w-4 h-4 text-premium-gold" />
            <span className="text-xs font-semibold tracking-widest uppercase text-premium-gold">Next-Gen Life OS</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight leading-tight mb-6"
          >
            Master Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-premium-goldDim italic">
              Legacy
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-lg md:text-xl text-premium-textMuted max-w-2xl mb-12 font-light"
          >
            A premium command center designed for absolute focus. Eliminate friction, orchestrate your systems, and ascend to a higher standard of operational excellence.
          </motion.p>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
             className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button onClick={onEnter} className="group relative px-8 py-4 bg-premium-gold text-premium-bg font-semibold rounded-none overflow-hidden hover:bg-premium-goldDim transition-all duration-300 shadow-goldGlow flex items-center justify-center space-x-3">
              <span className="tracking-widest uppercase text-sm">Initialize System</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
            
            <button className="px-8 py-4 bg-transparent border border-white/10 hover:border-premium-gold/50 text-premium-text font-semibold rounded-none transition-all duration-300 tracking-widest uppercase text-sm">
              Discover More
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-premium-textMuted mb-2">Scroll</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-premium-gold" />
          </motion.div>
        </motion.div>
      </main>

      {/* Feature Section Preview */}
      <section className="relative z-10 bg-premium-surface/50 border-t border-white/5 py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Frictionless Action", desc: "Execute commands with zero latency. A UI that anticipates your next move." },
            { icon: TrendingUp, title: "Aggregated Analytics", desc: "Your life's data, beautifully visualized in real-time heatmaps and charts." },
            { icon: Shield, title: "Absolute Control", desc: "Secure, private, and customizable. Your personal fortress of productivity." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="p-8 border border-white/5 bg-premium-bg/50 backdrop-blur-sm group hover:border-premium-gold/30 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-premium-gold mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
              <p className="text-premium-textMuted text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
