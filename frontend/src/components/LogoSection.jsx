import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

const LogoSection = () => {
  const logos = [
    { src: "https://res.cloudinary.com/dwdvr0oxa/image/upload/v1738917428/svg1_tolzrc.png", alt: "Triangle Logo" },
    { src: "https://res.cloudinary.com/dwdvr0oxa/image/upload/v1738917487/svg2_berngc.png", alt: "Box Logo" },
    { src: "https://res.cloudinary.com/dwdvr0oxa/image/upload/v1738920176/svg3_fy2qvd.png", alt: "Diamond Logo" },
    { src: "https://res.cloudinary.com/dwdvr0oxa/image/upload/v1738920274/svg4_ppjwas.png", alt: "Circle Logo" },
    { src: "https://res.cloudinary.com/dwdvr0oxa/image/upload/v1738920731/svg5_vefpxh.png", alt: "Hexagon Logo" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        
        navigation={false}
        modules={[Autoplay]}
        breakpoints={{
          370: {
            slidesPerView: 2,
          },
          414: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          }
        }}
      >
        {logos.map((logo, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center p-6 transition-transform hover:scale-110">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-20 w-auto grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LogoSection;