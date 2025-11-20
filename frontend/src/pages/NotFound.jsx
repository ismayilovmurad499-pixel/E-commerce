import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
            <p className="text-gray-600 mt-4">Axtardığınız səhifə tapılmadı.</p>
            <Link to="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Əsas səhifəyə qayıt
            </Link>
        </div>
    );
};

export default NotFound;