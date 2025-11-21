import React from 'react'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, ArrowRight } from 'lucide-react';

const Store = () => {
  return (
    <section className="py-20 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ümumi Başlıq */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Mağazamızı Ziyarət Edin
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Ən son məhsullarımızı və eksklüziv təkliflərimizi yerində kəşf edin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* SAĞ SÜTUN - Şəkil və Efektlər */}
          <div className="lg:order-2 relative group flex justify-center">
            {/* Arxa Kölgə Effekti (Daha incə parıltı) */}
            <div className="absolute inset-4 sm:inset-6 bg-gradient-to-br from-indigo-500/50 to-pink-500/50 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
            
            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white transform group-hover:scale-[1.01] transition-all duration-500">
              <img
                src="https://res.cloudinary.com/dwdvr0oxa/image/upload/v1740241625/1_xxbets.jpg"
                alt="Mağaza İnteryeri"
                className="w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>

          {/* SOL SÜTUN - Əlaqə Məlumatları */}
          <div className="lg:order-1 space-y-10">
            
            {/* Əlaqə Detalları Kartı */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
                
                <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4 flex items-center gap-2">
                    Əlaqə Məlumatları
                </h3>

                <div className="space-y-6">
                    {/* 1. Ünvan */}
                    <div className="flex items-start">
                        <MapPin className="w-6 h-6 text-indigo-600 mr-4 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-base font-semibold text-gray-700">Ünvanımız</p>
                            <p className="text-lg text-gray-900 mt-1">
                                342 East American Street, New York, USA - 1212
                            </p>
                            <a 
                                href="#" 
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mt-1 transition-colors"
                            >
                                Xəritədə Bax <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>

                    {/* 2. Telefon */}
                    <div className="flex items-start">
                        <Phone className="w-6 h-6 text-indigo-600 mr-4 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-base font-semibold text-gray-700">Telefon</p>
                            <a href="tel:+1817234234" className="text-lg text-gray-900 hover:text-indigo-600 transition-colors">
                                +1 (817) 234 - 234
                            </a>
                        </div>
                    </div>

                    {/* 3. Email */}
                    <div className="flex items-start">
                        <Mail className="w-6 h-6 text-indigo-600 mr-4 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-base font-semibold text-gray-700">Email</p>
                            <a href="mailto:info@goru-store.com" className="text-lg text-gray-900 hover:text-indigo-600 transition-colors">
                                info@goru-store.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sosial Media */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Bizi İzləyin</h3>
              <div className="flex space-x-6">
                
                {/* Facebook */}
                <a 
                  href="#" 
                  aria-label="Facebook" 
                  className="p-3 rounded-full text-gray-500 hover:text-white bg-gray-100 hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                >
                  <Facebook className="w-6 h-6" />
                </a>

                {/* Twitter */}
                <a 
                  href="#" 
                  aria-label="Twitter" 
                  className="p-3 rounded-full text-gray-500 hover:text-white bg-gray-100 hover:bg-blue-400 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                >
                  <Twitter className="w-6 h-6" />
                </a>

                {/* Instagram (Orijinalda yox idi, lakin e-ticarət üçün vacibdir) */}
                <a 
                  href="#" 
                  aria-label="Instagram" 
                  className="p-3 rounded-full text-gray-500 hover:text-white bg-gray-100 hover:bg-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                >
                  <Instagram className="w-6 h-6" />
                </a>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Store