import React, { useState, useEffect } from 'react';
import Product from '../components/Product';

const Introduction = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  // YENİ: "What's New" hissəsi üçün state
  const [activeTab, setActiveTab] = useState('Phones');

  const slides = [
    {
      badge: "SALE! UP TO 50% OFF!",
      title: "Summer Sale",
      subtitle: "Collections",
      buttonText: "SHOP NOW",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
      bgColor: "#faf7f0"
    },
    {
      badge: "NEW ARRIVALS",
      title: "Winter",
      subtitle: "Collection 2024",
      buttonText: "DISCOVER NOW",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
      bgColor: "#f5f5f5"
    },
    {
      badge: "TRENDING NOW",
      title: "Spring",
      subtitle: "Fashion",
      buttonText: "VIEW MORE",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop",
      bgColor: "#fff5f5"
    }
  ];

  // YENİ: Kateqoriyalar siyahısı
  const categories = ['Phones', 'Cameras', 'Laptop'];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality - hər 5 saniyədə avtomatik dəyişir
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <section 
        className="relative w-full overflow-hidden transition-colors duration-700"
        style={{ backgroundColor: slides[currentSlide].bgColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Slides Container */}
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div 
                    key={index}
                    className="w-full flex-shrink-0"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px] py-12 lg:py-0">
                      
                      {/* Sol Taraf - Mətn Kontenti */}
                      <div className="space-y-6 lg:space-y-8 z-10">
                        {/* Sale Badge */}
                        <div className="inline-block animate-fade-in">
                          <span className="text-xs md:text-sm font-medium tracking-wider uppercase text-gray-700">
                            {slide.badge}
                          </span>
                        </div>

                        {/* Başlıq */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-black animate-slide-up">
                          {slide.title}
                          <br />
                          {slide.subtitle}
                        </h1>

                        {/* CTA Button */}
                        <div className="animate-fade-in-delay">
                          <button className="bg-black text-white px-8 py-4 text-sm md:text-base font-semibold tracking-wider uppercase hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 rounded-md">
                            {slide.buttonText}
                          </button>
                        </div>
                      </div>

                      {/* Sağ Taraf - Şəkil */}
                      <div className="relative h-[500px] lg:h-[600px]">
                        {/* Ana Şəkil */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[120%] h-full">
                          <img
                            src={slide.image}
                            alt={`${slide.title} ${slide.subtitle}`}
                            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                          />
                        </div>

                        {/* Dekorativ Element - Sol Üst Künc */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/30 backdrop-blur-sm rounded-full -translate-x-1/2 -translate-y-1/2 hidden lg:block" />
                        
                        {/* Dekorativ Element - Sol Alt Künc */}
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full translate-x-1/4 translate-y-1/4 hidden lg:block" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index
                      ? 'w-12 h-3 bg-black'
                      : 'w-3 h-3 bg-gray-400 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Arxa fon dekorativ elementlər */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-gray-100/50 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full blur-3xl -z-10" />

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }

          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
          }

          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out 0.3s forwards;
            opacity: 0;
          }
        `}</style>
      </section>

      {/* ------------ YENİ HİSSƏ BAŞLANĞICI (WHAT'S NEW) ------------ */}
      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          {/* Başlıq */}
          <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight text-center">
            What's New
          </h2>

          {/* Tab/Menyu Hissəsi */}
          <div className="inline-flex bg-gray-100/80 p-1.5 rounded-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`
                  px-6 md:px-8 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300
                  ${activeTab === category 
                    ? 'bg-white text-black shadow-md scale-105' 
                    : 'bg-transparent text-gray-500 hover:text-black'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* ------------ YENİ HİSSƏ SONU ------------ */}

      {/* Product komponentinə seçilmiş kateqoriyanı ötürürük */}
      <Product category={activeTab} />
    </>
  );
};

export default Introduction;