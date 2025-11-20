import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = () => {
  const fromElementi = useRef();

  const sendEmail = function (e) {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_i2aoln8',
        'template_5ydt9ts',
        fromElementi.current,
        { publicKey: 'x5HEkmKZNmgk7_3e9' }
      )
      .then(
        () => {
          console.log('SUCCESS!');
          toast.success('Message sent successfully');
          // Formu sıfırlayırıq
          fromElementi.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          toast.error('Mesaj göndərilmədi');
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Başlıq və Açıqlama */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Bizimlə Əlaqə Saxlayın
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Hər hansı sualınız, təklifiniz və ya əməkdaşlıq təklifiniz varsa, aşağıdakı formu dolduraraq bizə müraciət edə bilərsiniz.
          </p>
        </div>

        {/* Form və Əlavə Məlumatlar */}
        <div className="flex flex-col lg:flex-row gap-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Əlaqə Məlumatları */}
          <div className="lg:w-1/3 space-y-8 p-6 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-cyan-400">Əlaqə Məlumatları</h3>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-cyan-500/20 rounded-full">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Telefon</p>
                  <p className="text-gray-400">+994 12 345 67 89</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">E-poçt</p>
                  <p className="text-gray-400">info@example.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-pink-500/20 rounded-full">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Ünvan</p>
                  <p className="text-gray-400">Bakı, Azərbaycan</p>
                </div>
              </div>
            </div>

            
          </div>

          {/* Form Hissəsi */}
          <form className="lg:w-2/3 space-y-8 p-6" onSubmit={sendEmail} ref={fromElementi}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Adınız</label>
                <input
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 text-gray-100 transition-all"
                  placeholder="Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">E-poçt</label>
                <input
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-gray-100 transition-all"
                  placeholder="example@mail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Telefon</label>
                <input
                  name="telephone"
                  type="tel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 text-gray-100 transition-all"
                  placeholder="+994 00 000 00 00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Subject</label>
                <input
                  name="subject"
                  type="subject"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400 text-gray-100 transition-all"
                  placeholder="Subject"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Mesajınız</label>
              <textarea
                name="message"
                rows="6"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 text-gray-100 resize-none transition-all"
                placeholder="Mesajınızı ətraflı şəkildə yazın..."
              ></textarea>
            </div>

            <div className="border-t border-white/20 pt-8">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-cyan-500/20 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Mesajı Göndər
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
