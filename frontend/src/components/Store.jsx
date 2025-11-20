import React from 'react'

const Store = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Visit Our Store
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-lg text-gray-700">
                    342 East American Street<br/>
                    New York, USA - 1212
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+1817234234" className="text-lg text-gray-700 hover:text-blue-600 transition-colors">
                  +1 (817) 234 - 234
                </a>
              </div>

              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-700 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@goru-store.com" className="text-lg text-gray-700 hover:text-blue-600 transition-colors">
                  info@goru-store.com
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-transform duration-300 hover:-translate-y-1">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.99H7.898v-2.887h2.54V9.845c0-2.508 1.493-3.89 3.78-3.89 1.096 0 2.24.195 2.24.195v2.462h-1.262c-1.243 0-1.63.771-1.63 1.562v1.868h2.773l-.443 2.887h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition-transform duration-300 hover:-translate-y-1">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.633 7.997c.013.176.013.353.013.53 0 5.383-4.098 11.584-11.584 11.584-2.3 0-4.436-.676-6.235-1.843.32.038.638.051.97.051 1.91 0 3.666-.651 5.063-1.751-1.78-.038-3.28-1.204-3.797-2.812.25.038.51.063.77.063.38 0 .763-.051 1.115-.15-1.867-.38-3.28-2.022-3.28-3.99v-.05c.55.305 1.19.487 1.866.51-1.115-.743-1.866-2.03-1.866-3.476 0-.763.202-1.477.55-2.095 2.013 2.49 5.03 4.13 8.445 4.297-.063-.305-.088-.63-.088-.953 0-2.317 1.866-4.197 4.197-4.197 1.204 0 2.29.506 3.053 1.33.953-.19 1.84-.53 2.65-1.006-.31.97-.97 1.79-1.84 2.305.85-.1 1.67-.33 2.42-.67-.57.83-1.3 1.56-2.14 2.13z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-red-600 transition-transform duration-300 hover:-translate-y-1">
                  <span className="sr-only">Pinterest</span>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.104 2C7.481 2 4 5.653 4 9.867c0 2.27.858 4.294 2.705 5.045.303.141.574.005.662-.33.06-.231.201-.814.263-1.058.086-.33.054-.445-.181-.732-.531-.63-.868-1.44-.868-2.589 0-3.335 2.58-6.322 6.671-6.322 3.63 0 5.621 2.208 5.621 5.15 0 3.118-1.396 5.752-3.459 5.752-1.142 0-1.997-.945-1.723-2.102.328-1.386.96-2.882.96-3.883 0-.897-.483-1.645-1.48-1.645-1.172 0-2.115 1.207-2.115 2.83 0 1.033.349 1.736.349 1.736s-1.182 5.004-1.394 5.909c-.418 1.78-.063 3.96-.032 4.177.018.129.178.165.251.063.105-.141 1.47-1.82 1.922-3.5.13-.463.744-2.937.744-2.937.368.703 1.442 1.316 2.585 1.316 3.404 0 5.712-3.093 5.712-7.228C20 4.908 17.021 2 13.104 2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl transform group-hover:-translate-y-2 transition-all duration-300">
              <img
                src="https://res.cloudinary.com/dwdvr0oxa/image/upload/v1740241625/1_xxbets.jpg"
                alt="Store Interior"
                className="w-full h-full object-cover aspect-[3/2]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Store