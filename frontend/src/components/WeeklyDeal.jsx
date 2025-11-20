import { useState, useEffect } from 'react';

const WeeklyDeal = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);

        const timer = setInterval(() => {
            const now = new Date();
            const difference = endDate - now;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({
                days,
                hours,
                minutes, 
                seconds
            });

            if (difference < 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-2xl max-w-7xl mx-auto my-20 p-10 md:p-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Left Content */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Weekly Deal
                    </h2>
                    <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-8">
                        $179.00
                    </div>
                    
                    {/* Timer */}
                    <div className="flex gap-4 mb-8 justify-center md:justify-start">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gray-50 text-gray-900 p-4 rounded-lg min-w-[4rem] shadow-sm">
                                    {String(value).padStart(2, '0')}
                                </div>
                                <div className="text-gray-500 uppercase text-sm mt-2">
                                    {unit}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md">
                        SHOP NOW
                    </button>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2">
                    <img 
                        src="https://res.cloudinary.com/dwdvr0oxa/image/upload/v1738916588/2_witg7u.png" 
                        alt="Monitor Deal" 
                        className="rounded-lg w-full max-w-md mx-auto h-auto object-cover"
                    />
                    {/* Subtle Decorative Border */}
                    <div className="absolute inset-0 border-2 border-gray-100 rounded-lg pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default WeeklyDeal;