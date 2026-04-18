'use client';

import { useState } from 'react';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const services = [
    'Register for a TPIN',
    'File Returns',
    'Pay Taxes Online',
    'Apply for Tax Compliance Certificate',
    'Import a vehicle',
    'Smart Invoice Registration',
    'Customs Clearance',
    'Motor Vehicle Tax Calculator'
  ];

  const newsItems = [
    {
      title: "ZRA TO PARTICIPATE IN LUSAKA'S AGRICULTURAL & COMMERCIAL SHOW",
      author: "Kumbwani Mambo",
      date: "September 26, 2025",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: '"EVERYONE MUST PAY TAXES" – Dr Musokotwane',
      author: "Kumbwani Mambo", 
      date: "September 25, 2025",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "ZRA SEIZES 300 CASES OF SMUGGLED KONYAGI BEER",
      author: "Kumbwani Mambo",
      date: "September 24, 2025", 
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans overflow-x-hidden">
      {/* Top navigation bar */}
      <div className="bg-[#1e40af] text-white text-xs py-2 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex gap-3 sm:gap-6 text-xs">
            <span className="hover:underline cursor-pointer">Motor Vehicle Search</span>
            <span className="hover:underline cursor-pointer">LOGIN</span>
          </div>
          <div className="hidden sm:flex gap-3 lg:gap-6 text-xs">
            <span className="hover:underline cursor-pointer">About Us</span>
            <span className="hover:underline cursor-pointer">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Header with logo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#1e40af] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-xl">ZRA</span>
              </div>
              <div className="text-left">
                <h1 className="text-sm sm:text-xl lg:text-2xl font-bold text-[#1e40af] tracking-wide leading-tight">
                  ZAMBIA REVENUE AUTHORITY
                </h1>
                <p className="text-xs sm:text-sm text-amber-600 font-semibold italic">
                  My Tax Your Tax Our Destiny
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section with service selector */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                Get started with
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <select 
                  className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select Service...</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
                <button 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedService}
                >
                  Click here
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <main className="flex-1 py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Latest News</h2>
            <p className="text-base sm:text-lg text-gray-600">Latest events and announcements from the ZRA</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newsItems.map((item, index) => (
              <article key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 bg-gray-200">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 leading-tight hover:text-blue-600 cursor-pointer transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <span>👤 {item.author}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e40af] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p>© 2025 Zambia Revenue Authority. All rights reserved</p>
        </div>
      </footer>

      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-[#1e40af] hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl z-50 transition-all duration-300 border-4 border-white"
        onClick={() => setShowChat(!showChat)}
        aria-label="Open chatbot"
      >
        🤖
      </button>

      <Chatbot isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
}
