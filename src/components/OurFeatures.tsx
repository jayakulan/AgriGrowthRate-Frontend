import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const featuresList = [
  {
    id: 1,
    title: 'Direct Marketplace',
    desc: 'Buy and sell fresh produce directly. Skip the middlemen and get the best prices.'
  },
  {
    id: 2,
    title: 'AI Farming Assistant',
    desc: 'Get instant, expert advice on farming practices, pest control, and management.'
  },
  {
    id: 3,
    title: 'Crop Disease Detection',
    desc: 'Upload a photo of a sick plant and our AI will instantly diagnose the disease.'
  },
  {
    id: 4,
    title: 'Weather Advisory',
    desc: 'Receive timely alerts and recommendations based on local weather forecasts.'
  },
  {
    id: 5,
    title: 'Smart Recommendations',
    desc: 'Get personalized crop suggestions based on your soil, climate, and demand.'
  }

];

export default function OurFeatures() {
  const [activeId, setActiveId] = useState(2); // Default active item

  return (
    <section id="feature" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 font-sans bg-white relative z-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-semibold text-[#3E5C27] flex items-center gap-1">
          Our Features
        </h2>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch lg:h-[550px]">
        {/* Left Column: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:w-[22%] flex flex-col py-2"
        >
          <p className="text-gray-500 text-sm leading-loose">
            AgriGrowthRate is a smart agriculture platform that connects farmers and consumers through a direct marketplace while providing AI assistance, crop disease detection, weather advisory, and smart recommendations to improve farming decisions and productivity.
          </p>
        </motion.div>

        {/* Middle Column: Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-[38%] h-[300px] lg:h-full"
        >
          <img
            src="/gardening_shears.png"
            alt="Gardening shears"
            className="w-full h-full object-cover rounded-[32px] shadow-sm"
          />
        </motion.div>

        {/* Right Column: Accordion */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:w-[40%] flex flex-col gap-3 lg:h-full pr-1"
        >
          {featuresList.map((feature) => {
            const isActive = activeId === feature.id;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveId(feature.id)}
                className={`cursor-pointer rounded-[20px] transition-all duration-300 overflow-hidden border border-transparent ${isActive ? 'bg-[#3E5C27] text-white p-5 md:p-6 shadow-md' : 'bg-[#F2F7ED] text-[#3E5C27] hover:bg-[#E8F2DF] p-4 md:p-5'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium text-[15px] md:text-base ${isActive ? 'text-white font-semibold' : 'text-[#3E5C27]'}`}>
                    {feature.title}
                  </h3>
                  <div className={`rounded-full flex-shrink-0 flex items-center justify-center w-7 h-7 ${isActive ? 'bg-white text-[#3E5C27]' : 'bg-white text-[#3E5C27] shadow-sm'}`}>
                    {isActive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" strokeWidth={3} />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-100 text-xs md:text-sm leading-relaxed pr-4">
                        {feature.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
