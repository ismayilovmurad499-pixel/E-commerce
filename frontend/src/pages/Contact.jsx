import React, { useState } from 'react';

// Xəritə komponenti
const Harita = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194473.22199065257!2d49.70845994999999!3d40.39479125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2zQmFrxLEsIEF6yZlyYmF5Y2Fu!5e0!3m2!1str!2s!4v1234567890123!5m2!1str!2s"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Ofis Yeri"
    />
  );
};

// ContactForm komponenti
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mesajınız göndərildi!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ad Soyad
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          placeholder="Adınızı yazın"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          placeholder="email@example.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mesajınız
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
          placeholder="Mesajınızı yazın..."
        />
      </div>
      
      <button
        onClick={handleSubmit}
        className="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Göndər
      </button>
    </div>
  );
};

const Contact = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Başlıq */}
      <section className="border-b border-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-gray-900">Ana səhifə</a>
            <span>/</span>
            <span className="text-gray-900">Əlaqə</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Əlaqə
          </h1>
          <p className="text-lg text-gray-600">
            Bizimlə əlaqə saxlamaq üçün aşağıdaki formu doldurun
          </p>
        </div>
      </section>

      {/* Form və Məlumatlar */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Forma */}
            <div className="md:col-span-2">
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Mesaj göndərin
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Əlaqə məlumatları */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Əlaqə
                </h3>
                <div className="space-y-3">
                  <a href="mailto:info@company.az" className="block text-gray-600 hover:text-gray-900 transition-colors">
                    info@company.az
                  </a>
                  <a href="tel:+994501234567" className="block text-gray-600 hover:text-gray-900 transition-colors">
                    +994 50 123 45 67
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Ünvan
                </h3>
                <p className="text-gray-600">
                  Bakı şəhəri<br />
                  Nəsimi rayonu
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  İş saatları
                </h3>
                <p className="text-gray-600">
                  Bazar ertəsi - Cümə<br />
                  09:00 - 18:00
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Xəritə */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ofisimizin yeri
          </h2>

          <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            <div className="h-[450px] md:h-[550px] w-full">
              <Harita />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;