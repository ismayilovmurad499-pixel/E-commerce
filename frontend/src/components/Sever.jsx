import React from 'react';
import { Phone, Package, Award, Truck } from 'lucide-react';

const Sever = () => {
  const features = [
    {
      icon: <Phone className="w-12 h-12" />,
      title: '24/7 Customer Service',
      description: "We're here to help you with any questions or concerns you have, 24/7."
    },
    {
      icon: <Package className="w-12 h-12" />,
      title: '14-Day Money Back',
      description: "If you're not satisfied with your purchase, simply return it within 14 days for a refund."
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Our Guarantee',
      description: 'We stand behind our products and services and guarantee your satisfaction.'
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: 'Shipping Worldwide',
      description: 'We ship our products worldwide, making them accessible to customers everywhere.'
    }
  ];

  return (
    <div className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-gray-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sever;