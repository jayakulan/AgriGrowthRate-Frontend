import React from 'react';
import { Monitor, BarChart2, CloudDownload, ShoppingBasket } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const steps = [
  {
    num: '01',
    title: 'CREATE ACCOUNT',
    desc: 'Sign up quickly as a farmer or consumer to access our smart platform.',
    bgClass: 'bg-[#4A6D2F]',
    textColor: '#4A6D2F',
    icon: <Monitor className="w-7 h-7 text-white/90" />
  },
  {
    num: '02',
    title: 'ACCESS AI TOOLS',
    desc: 'Use our AI to scan crops, check weather, or chat for farming advice.',
    bgClass: 'bg-[#b0c49f]',
    textColor: '#b0c49f',
    icon: <BarChart2 className="w-7 h-7 text-white/90" />
  },
  {
    num: '03',
    title: 'TRADE DIRECTLY',
    desc: 'List your produce or buy fresh goods from the marketplace securely.',
    bgClass: 'bg-[#4A6D2F]',
    textColor: '#4A6D2F',
    icon: <CloudDownload className="w-7 h-7 text-white/90" />
  },
  {
    num: '04',
    title: 'GROW & PROFIT',
    desc: 'Enjoy higher yields and better market prices with our data-driven approach.',
    bgClass: 'bg-[#b0c49f]',
    textColor: '#b0c49f',
    icon: <ShoppingBasket className="w-7 h-7 text-white/90" />
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#edf4e2] relative z-10 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header (Hidden on Desktop since Desktop has the vertical pill) */}
        <div className="md:hidden text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#3e5c27] mb-4">
            HOW IT WORKS
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Get started with AgriGrowthRate in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Steps */}
          <div className="lg:col-span-7 relative order-2 lg:order-1">
            {/* Vertical white pill (Desktop only) */}
            <div className="hidden md:flex flex-col items-center justify-center bg-white w-24 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.05)] z-20 absolute left-0 top-0 bottom-0 py-8">
              <div className="transform -rotate-90 text-[#3e5c27] font-black tracking-[0.2em] whitespace-nowrap text-3xl h-full flex items-center justify-center">
                HOW IT WORKS
              </div>
            </div>

            <div className="w-full md:pl-36 flex flex-col gap-5">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-center"
                >
                  {/* Connector line (Desktop only) */}
                  {/* It connects from the pill (left: 0, width: 24 (96px)) to the circular badge. */}
                  <div className="hidden md:block absolute -left-12 w-12 h-1.5 bg-white shadow-sm z-0"></div>
                  
                  {/* Colored Bar */}
                  <div className={`relative flex items-center w-full ${step.bgClass} rounded-l-[40px] md:rounded-l-full rounded-r-sm pr-6 md:pr-10 py-5 shadow-sm min-h-[100px]`}>
                    
                    {/* White Circle Number */}
                    <div 
                      className="absolute -left-4 md:-left-8 w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center font-black text-xl md:text-2xl shadow-md z-10"
                      style={{ color: step.textColor }}
                    >
                      {step.num}
                    </div>
                    
                    {/* Content */}
                    <div className="pl-14 md:pl-16 pr-4 flex-1">
                      <h3 className="text-white font-bold text-sm md:text-base tracking-wide mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-sm">
                        {step.desc}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 opacity-80 hidden sm:block">
                      {step.icon}
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Overlapping Image Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end py-12 lg:py-0 order-1 lg:order-2 lg:translate-x-8">
            <div className="relative w-[340px] sm:w-[420px] aspect-[4/5]">
              
              {/* Background Image (Top Right) - Vegetables (Now in Back) */}
              <motion.div 
                className="absolute top-4 right-4 w-[76%] h-[81%] z-0"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* 4-pointed Sparkle/Star Doodle (Top Left of Back Image) */}
                <div className="absolute -top-7 -left-7 w-14 h-14 text-[#4a6d2f] z-20 pointer-events-none drop-shadow-[0_2px_4px_rgba(74,109,47,0.2)]">
                  <svg viewBox="0 0 50 50" fill="currentColor" className="w-full h-full">
                    <path d="M 25,5 C 24.5,16 16.5,24.5 5,25 C 16.5,25.5 24.5,33.5 25,45 C 25.5,33.5 33.5,25.5 45,25 C 33.5,24.5 25.5,16 25,5 Z" />
                  </svg>
                </div>

                {/* White Container Board + Image */}
                <div className="w-full h-full rounded-[2.5rem] bg-white p-2.5 overflow-hidden shadow-lg relative">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                    <Image 
                      src="/fresh_crops_harvest.png" 
                      alt="Fresh Farm Harvest" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                      priority
                    />
                  </div>
                </div>

                {/* Hand-drawn Outer Border Overlay */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none text-[#4a6d2f] overflow-visible animate-pulse-subtle" 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3.5"
                >
                  <path d="M 12,2 C 35,1.5 65,2.5 88,2 C 95,1.8 98,5 98,12 C 98.5,35 97.5,65 98,88 C 98,95 95,98 88,98 C 65,97.5 35,98.5 12,98 C 5,98 2,95 2,88 C 1.5,65 2.5,35 2,12 C 2,5 5,2 12,2 Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              {/* Foreground Image (Bottom Left) - Smart Agriculture Farmer (Now in Front) */}
              <motion.div 
                className="absolute bottom-4 left-4 w-[62%] h-[67%] z-10"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* White Container Board + Image */}
                <div className="w-full h-full rounded-[2rem] bg-white p-2.5 overflow-hidden shadow-md relative">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <Image 
                      src="/farmer_tech_field.png" 
                      alt="Smart Agriculture Farmer" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 280px"
                    />
                  </div>
                </div>

                {/* Hand-drawn Outer Border Overlay */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none text-[#4a6d2f] overflow-visible animate-pulse-subtle" 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3.5"
                >
                  <path d="M 12,2 C 35,1.5 65,2.5 88,2 C 95,1.8 98,5 98,12 C 98.5,35 97.5,65 98,88 C 98,95 95,98 88,98 C 65,97.5 35,98.5 12,98 C 5,98 2,95 2,88 C 1.5,65 2.5,35 2,12 C 2,5 5,2 12,2 Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {/* Scalloped Flower/Badge Doodle (Bottom Right of Front Image) */}
                <div className="absolute -bottom-7 -right-7 w-14 h-14 text-[#4a6d2f] z-20 pointer-events-none drop-shadow-[0_2px_4px_rgba(74,109,47,0.2)]">
                  <svg viewBox="0 0 50 50" className="w-full h-full" fill="currentColor">
                    <path d="M 25,12 C 28,12 30,9 33,10 C 36,11 37,14 40,17 C 43,20 42,22 42,25 C 42,28 43,30 40,33 C 37,36 36,39 33,40 C 30,41 28,38 25,38 C 22,38 20,41 17,40 C 14,39 13,36 10,33 C 7,30 8,28 8,25 C 8,22 7,20 10,17 C 13,14 14,11 17,10 C 20,9 22,12 25,12 Z" />
                    <circle cx="25" cy="25" r="5" fill="#edf4e2" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
}
