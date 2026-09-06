'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Mail, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { contactService } from '@/services/contactService';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.contactNo.trim() ||
      !formData.message.trim()
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const res = await contactService.submitContactMessage({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        contactNo: formData.contactNo.trim(),
        message: formData.message.trim(),
      });

      toast.success(res.message || 'Thank you! Your message has been sent successfully.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        message: '',
      });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || 'Failed to send message. Please try again later.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-bold text-[#3E5C27]">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    disabled={loading}
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                {/* Last Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-bold text-[#3E5C27]">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your Last name"
                    disabled={loading}
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-bold text-[#3E5C27]">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={loading}
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                {/* Contact Details */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="contactNo" className="text-sm font-bold text-[#3E5C27]">
                    Contact Details
                  </label>
                  <input
                    id="contactNo"
                    name="contactNo"
                    type="tel"
                    required
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    disabled={loading}
                    className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-bold text-[#3E5C27]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  disabled={loading}
                  className="w-full border border-gray-200 rounded-[20px] px-5 py-4 text-sm focus:outline-none focus:border-[#4A6D2F] focus:ring-1 focus:ring-[#4A6D2F] placeholder-gray-400 transition-colors resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#4A6D2F] hover:bg-[#3E5C27] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send a Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Details Column */}
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
