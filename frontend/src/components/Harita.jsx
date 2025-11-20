import React from 'react'

const Harita = () => {
  return (
    <section class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4">
    
    <div class="relative w-full h-96 rounded-md overflow-hidden shadow">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.5876577116253!2d-6.26025728439952!3d53.34277547997762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e9d0a53b15d%3A0x59ad3f2fa79b8f8e!2sGrafton%20Street%2C%20Dublin%2C%20Ireland!5e0!3m2!1str!2str!4v1677326000000!5m2!1str!2str"
        class="absolute inset-0 w-full h-full border-0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>

  )
}

export default Harita