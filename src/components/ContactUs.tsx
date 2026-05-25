import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactUs() {
  return (
    <section id="contact" className="py-10 bg-white relative z-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-[#3E5C27] mb-6 tracking-tight">
          Contact Us
        </h2>

        {/* Outer White Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 15, duration: 0.8 }}
          className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 w-full"
        >

          {/* Left Form Column */}
          <div className="w-full lg:w-[60%] flex flex-col justify-center p-2 md:p-4">
            <h3 className="text-2xl font-bold text-[#3E5C27] mb-3">
              Send us a message
            </h3>
            <p className="text-gray-500 text-sm mb-8 max-w-lg leading-relaxed">
              Do you have a question? A complaint? Or need any help to choose the right product from AgriGrowthRate. Feel free to contact us.
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#3E5C27]">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors"
                  />
                </div>
                {/* Last Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#3E5C27]">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your Last name"
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#3E5C27]">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors"
                  />
                </div>
                {/* Contact Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#3E5C27]">Contact Details</label>
                  <input
                    type="tel"
                    placeholder="Enter your contact number"
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#3E5C27]">Message</label>
                <textarea
                  placeholder="Enter your message"
                  rows={4}
                  className="w-full border border-gray-200 rounded-[20px] px-5 py-4 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button type="button" className="bg-[#4A6D2F] hover:bg-[#3E5C27] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-[1.02] shadow-md hover:shadow-lg">
                  Send a Message
                </button>
              </div>
            </form>
          </div>

          {/* Right Details Column (stays completely inside the outer card container) */}
          <div className="w-full lg:w-[40%] bg-[#3E5C27] rounded-[24px] p-8 flex flex-col text-white justify-center shadow-lg">
            <h3 className="text-2xl font-bold mb-8 leading-snug">
              Hi! We are always here to help you.
            </h3>

            <div className="flex flex-col gap-5">
              <div className="bg-white/10 rounded-xl p-4.5 flex items-center gap-4 shadow-sm border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-all">
                <Phone className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-gray-300 mb-0.5">Phone Number:</div>
                  <div className="text-sm font-medium">077 334 4195</div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4.5 flex items-center gap-4 shadow-sm border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-all">
                <MapPin className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-gray-300 mb-0.5">Address:</div>
                  <div className="text-sm font-medium">Manipay Road, Kopay Center.</div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4.5 flex items-center gap-4 shadow-sm border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-all">
                <Mail className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-gray-300 mb-0.5">Email:</div>
                  <div className="text-sm font-medium">info@agrlanka.com</div>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
