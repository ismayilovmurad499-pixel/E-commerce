// src/components/PaymentComponent.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPaymentIntent, resetPaymentState } from '../slices/paymentSlice';
import { useGetCartQuery } from '../redux/api/productsApi';
import { CreditCard, ShieldCheck, Lock, AlertCircle, CheckCircle, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';

// --- UĞURLU ÖDƏNİŞ QƏBZİ KARTI ---
const SuccessReceiptCard = ({ total, currency, cartItems, onComplete }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete(); // Ana səhifəyə yönləndir
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="rounded-2xl bg-white shadow-2xl p-8 border-2 border-green-500">
            {/* Başlıq */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    Ödəniş Uğurlu!
                </h3>
                <p className="text-gray-600">
                    Sifarişiniz qəbul edildi və tezliklə hazırlanacaq
                </p>
            </div>

            {/* Məhsullar */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Sifariş Edilən Məhsullar
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map(item => (
                        <div key={item.product._id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                                    <img
                                        src={item.product.images?.[0]?.url || "/placeholder.svg"}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                        {item.product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Say: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                                {(item.product.price * item.quantity).toFixed(2)} ₼
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ümumi Məbləğ */}
            <div className="bg-green-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                        Ödənilmiş Məbləğ
                    </span>
                    <span className="text-3xl font-bold text-green-600">
                        {total.toFixed(2)} {currency.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Yönləndirmə Mesajı */}
            <div className="text-center py-4 bg-blue-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                    Ana səhifəyə yönləndirilib... <span className="font-bold">{countdown} saniyə</span>
                </p>
            </div>

            {/* Düymə */}
            <button
                onClick={onComplete}
                className="w-full flex justify-center items-center py-4 px-6 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
                İndi Ana Səhifəyə Get
                <ArrowRight className="w-5 h-5 ml-2" />
            </button>
        </div>
    );
};

const PaymentComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, clientSecret, error } = useSelector((state) => state.payment);
    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();

    const [currency, setCurrency] = useState('azn');

    const calculateTotal = () => {
        if (!cartData?.cart) return 0;
        return cartData.cart.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };

    const totalAmount = calculateTotal();
    const shipping = 0;
    const finalTotal = totalAmount + shipping;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createPaymentIntent({ amount: totalAmount, currency }));
    };

    const handleReset = () => {
        dispatch(resetPaymentState());
        setCurrency('azn');
    };

    const handlePaymentComplete = () => {
        dispatch(resetPaymentState());
        navigate('/'); // Ana səhifəyə yönləndir
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Başlıq */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                        <Lock className="w-8 h-8 text-gray-900" />
                        Təhlükəsiz Ödəniş
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Sifarişinizi tamamlamaq üçün məlumatları daxil edin
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* SOL: Ödəniş Formu / Qəbz */}
                    <div className="lg:col-span-7">
                        
                        {clientSecret ? (
                            <SuccessReceiptCard 
                                total={finalTotal}
                                currency={currency}
                                cartItems={cartData?.cart || []}
                                onComplete={handlePaymentComplete}
                            />
                        ) : (
                            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Ödəniş Məlumatları
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Valyuta */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ödəniş Valyutası
                                        </label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        >
                                            <option value="azn">AZN - Azərbaycan Manatı (₼)</option>
                                            <option value="usd">USD - ABŞ Dolları ($)</option>
                                            <option value="eur">EUR - Avro (€)</option>
                                            <option value="try">TRY - Türk Lirəsi (₺)</option>
                                        </select>
                                    </div>

                                    {/* Təhlükəsizlik Mesajı */}
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                        <div className="flex">
                                            <ShieldCheck className="h-5 w-5 text-blue-500" />
                                            <p className="ml-3 text-sm text-blue-700">
                                                Ödənişiniz SSL şifrələməsi ilə qorunur
                                            </p>
                                        </div>
                                    </div>

                                    {/* Düymələr */}
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 flex justify-center items-center py-4 px-6 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                                    Emal edilir...
                                                </>
                                            ) : (
                                                `Ödə (${finalTotal.toFixed(2)} ${currency.toUpperCase()})`
                                            )}
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="px-6 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Sıfırla
                                        </button>
                                    </div>
                                </form>

                                {/* Xəta */}
                                {error && (
                                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex">
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">Xəta</h3>
                                                <p className="mt-1 text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                    </div>

                    {/* SAĞ: Sifariş Xülasəsi */}
                    <div className="lg:col-span-5">
                        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 sticky top-6">
                            <div className="p-6 bg-gray-50 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Sifariş Xülasəsi
                                </h3>
                            </div>
                            
                            <div className="p-6">
                                {isCartLoading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
                                    </div>
                                ) : cartData && cartData.cart.length > 0 ? (
                                    <>
                                        <ul className="space-y-4 mb-6">
                                            {cartData.cart.map((item) => (
                                                <li key={item.product._id} className="flex gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                                        <img
                                                            src={item.product.images?.[0]?.url || "/placeholder.svg"}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 text-sm">
                                                            {item.product.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            Say: {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                                            {(item.product.price * item.quantity).toFixed(2)} ₼
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Məhsul Dəyəri</span>
                                                <span>{totalAmount.toFixed(2)} ₼</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Çatdırılma</span>
                                                <span>Pulsuz</span>
                                            </div>
                                            <div className="border-t pt-4 flex justify-between">
                                                <span className="text-lg font-bold text-gray-900">Cəmi</span>
                                                <span className="text-xl font-bold text-gray-900">
                                                    {finalTotal.toFixed(2)} ₼
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10">
                                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">Səbətiniz boşdur</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default PaymentComponent;