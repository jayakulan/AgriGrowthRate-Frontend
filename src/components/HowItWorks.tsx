import React from 'react';
import { Monitor, BarChart2, CloudDownload, ShoppingBasket } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <section id="how-it-works" className="py-24 bg-[#edf4e2] relative z-10 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header (Hidden on Desktop since Desktop has the vertical pill) */}
        <div className="md:hidden text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#3e5c27] mb-4">
            HOW IT WORKS
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Get started with AgriGrowthRate in four simple steps.
          </p>
        </div>

        <div className="relative flex justify-center">
          
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
        
      </div>
    </section>
  );
}
