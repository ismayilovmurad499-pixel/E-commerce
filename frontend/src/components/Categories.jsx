import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Categories = () => {
    return (
        <div className="container mx-auto px-4 py-16 bg-white">
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                }}
                modules={[Autoplay]}
                className="w-full pb-12"
            >
                {/* Camera */}
                <SwiperSlide className="h-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-200 hover:border-blue-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                Camera
                            </h3>
                            <svg className="w-14 h-14 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                <circle cx="12" cy="13" r="4"/>
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Drones */}
                <SwiperSlide className="h-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-200 hover:border-blue-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                Drones
                            </h3>
                            <svg className="w-14 h-14 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Gaming */}
                <SwiperSlide className="h-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-200 hover:border-blue-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                Gaming
                            </h3>
                            <svg className="w-14 h-14 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
                                <path d="M14 12h4"/>
                                <path d="M7 10v4"/>
                                <path d="M9 12H5"/>
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>

                {/* LED TV */}
                <SwiperSlide className="h-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-200 hover:border-blue-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                LED TV
                            </h3>
                            <svg className="w-14 h-14 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                                <polyline points="17 2 12 7 7 2"/>
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Routers */}
                <SwiperSlide className="h-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-200 hover:border-blue-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                Routers
                            </h3>
                            <svg className="w-14 h-14 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                                <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Gaming PC */}
                <SwiperSlide className="h-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-200 hover:border-blue-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                Gaming PC
                            </h3>
                            <svg className="w-14 h-14 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Categories;
