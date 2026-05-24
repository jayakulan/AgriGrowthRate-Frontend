import React from 'react';
import { Phone, MessageCircle, Mail, ChevronDown } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <section id="contact" className="py-24 bg-[#F8F9FA] relative z-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#112031] mb-12">
          Contact Us
        </h2>

        <div className="relative flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-0">
          
          {/* Left Form Card */}
          <div className="w-full lg:w-[68%] bg-white rounded-[32px] p-8 md:p-12 shadow-sm z-10">
            <h3 className="text-2xl font-bold text-[#112031] mb-3">
              Send us a message
            </h3>
            <p className="text-gray-500 text-sm mb-10 max-w-lg leading-relaxed">
              Do you have a question? A complaint? Or need any help to choose the right product from AgriGrowthRate. Feel free to contact us
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#112031]">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your first name" 
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#112031] focus:ring-1 focus:ring-[#112031] placeholder-gray-400 transition-colors"
                  />
                </div>
                {/* Last Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#112031]">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your Last name" 
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#112031] focus:ring-1 focus:ring-[#112031] placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#112031]">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#112031] focus:ring-1 focus:ring-[#112031] placeholder-gray-400 transition-colors"
                  />
                </div>
                {/* Contact Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#112031]">Contact Details</label>
                  <div className="flex w-full border border-gray-200 rounded-full overflow-hidden focus-within:border-[#112031] focus-within:ring-1 focus-within:ring-[#112031] transition-colors">
                    <div className="flex items-center gap-2 bg-white px-4 border-r border-gray-200 cursor-pointer">
                      <span className="text-sm font-bold text-gray-700">+1</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Enter your contact number" 
                      className="w-full px-4 py-3.5 text-sm focus:outline-none placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#112031]">Message</label>
                <textarea 
                  placeholder="Enter your message" 
                  rows={4}
                  className="w-full border border-gray-200 rounded-[20px] px-5 py-4 text-sm focus:outline-none focus:border-[#112031] focus:ring-1 focus:ring-[#112031] placeholder-gray-400 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button type="button" className="bg-[#112031] hover:bg-[#1a2f4c] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-colors shadow-md">
                  Send a Message
                </button>
              </div>
            </form>
          </div>

          {/* Right Info Card */}
          <div className="w-full lg:w-[32%] bg-[#112031] lg:-ml-8 lg:mt-8 rounded-[32px] p-8 md:p-10 shadow-xl z-20 flex flex-col text-white min-h-[480px]">
            <h3 className="text-[22px] font-semibold mb-8 leading-snug">
              Hi! We are always here to help you.
            </h3>

            <div className="flex flex-col gap-4 mb-10">
              <div className="bg-[#304156] rounded-xl p-4 flex items-center gap-4 shadow-sm border border-white/5">
                <Phone className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-gray-300 mb-0.5">Hotline:</div>
                  <div className="text-sm font-medium">+1 (800) 123-4567</div>
                </div>
              </div>

              <div className="bg-[#304156] rounded-xl p-4 flex items-center gap-4 shadow-sm border border-white/5">
                <MessageCircle className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-gray-300 mb-0.5">SMS / Whatsapp</div>
                  <div className="text-sm font-medium">+1 (800) 987-6543</div>
                </div>
              </div>

              <div className="bg-[#304156] rounded-xl p-4 flex items-center gap-4 shadow-sm border border-white/5">
                <Mail className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                <div>
                  <div className="text-xs text-gray-300 mb-0.5">Email:</div>
                  <div className="text-sm font-medium">support@agrigrowthrate.com</div>
                </div>
              </div>
            </div>

            <hr className="border-gray-600/50 mb-8" />

            <div className="mt-auto">
              <div className="text-sm font-semibold mb-5 text-white/90">Connect with us</div>
              <div className="flex items-center gap-5">
                <FaFacebook className="w-5 h-5 text-white/80 hover:text-white cursor-pointer transition-colors" />
                <FaInstagram className="w-5 h-5 text-white/80 hover:text-white cursor-pointer transition-colors" />
                <FaYoutube className="w-5 h-5 text-white/80 hover:text-white cursor-pointer transition-colors" />
                <FaTwitter className="w-5 h-5 text-white/80 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
