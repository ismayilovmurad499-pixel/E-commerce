// src/components/PaymentComponent.jsx

// (Əvvəlki importlar və funksiyalar olduğu kimi qalır...)
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent, resetPaymentState } from '../slices/paymentSlice';
import { useGetCartQuery } from '../redux/api/productsApi';
import { CreditCard, ShieldCheck, Lock, AlertCircle, CheckCircle, Loader2, ShoppingBag, Receipt, ArrowRight, Clipboard } from 'lucide-react';

// --- YENİ KOMPONENT: UĞURLU ÖDƏNİŞ QƏBZİ KARTI ---
const SuccessReceiptCard = ({ total, clientSecret, currency, cartItems }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(clientSecret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-2xl bg-white shadow-2xl p-6 sm:p-8 border-4 border-dashed border-green-300">
            <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-gray-900">Ödəniş Başladı!</h3>
                <p className="mt-2 text-gray-600">
                    Sifarişiniz ödəniş sisteminə ötürüldü. Aşağıdakı detalları yoxlayın.
                </p>
            </div>
            
            <div className="border-t border-dashed border-gray-300 my-6"></div>

            {/* Məbləğ Xülasəsi */}
            <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg mb-6">
                <span className="text-lg font-semibold text-green-800">Ümumi Ödəniş</span>
                <span className="text-3xl font-extrabold text-green-600">
                    {total.toFixed(2)} {currency.toUpperCase()}
                </span>
            </div>

            {/* Məhsul Siyahısı (Mini-Xülasə) */}
            <div className="space-y-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                    <div key={item.product._id} className="flex justify-between text-sm text-gray-600">
                        <span className="truncate" title={item.product.name}>
                            {item.product.name} ({item.quantity}x)
                        </span>
                        <span>
                            {(item.product.price * item.quantity).toFixed(2)} ₼
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Texniki Məlumat (Gizli və ya Debuq üçün) */}
            <details className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <summary className="font-semibold flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Ödəniş ID-si (Texniki Detallar)
                </summary>
                <div className="mt-2 ml-4">
                    <p className="break-all font-mono text-gray-700">{clientSecret}</p>
                    <button 
                        onClick={copyToClipboard}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 transition-colors"
                    >
                        <Clipboard className="w-3 h-3" />
                        {copied ? 'Kopyalandı!' : 'Kopyala'}
                    </button>
                </div>
            </details>
            
            <button
                onClick={() => { /* Gələcəkdə Stripe Elements Componentini yükləyəcək düymə */ }}
                className="w-full mt-6 flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
            >
                Ödənişi Tamamla <ArrowRight className="w-5 h-5 ml-2" />
            </button>
        </div>
    );
};
// --- YENİ KOMPONENTİN SONU ---

const PaymentComponent = () => {
    const dispatch = useDispatch();
    const { loading, clientSecret, error } = useSelector((state) => state.payment);
    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();

    const [currency, setCurrency] = useState('usd');

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
        setCurrency('usd');
    };

    useEffect(() => {
        if (clientSecret) {
            // Məhsulu sifariş edib ödənişə keçmək üçün avtomatik sıfırlamanı ləğv etdim
            // İstifadəçinin Payment Elements ilə ödənişi tamamlamağa ehtiyacı var
            // Avtomatik sıfırlama ancaq debug məqsədi ilə istifadə oluna bilər.
            // Bu səbəbdən, vaxtlayıcı (timer) silinir.
        }
    }, [clientSecret]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans text-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center gap-3">
                        <Lock className="w-8 h-8 text-indigo-600" />
                        Təhlükəsiz Ödəniş
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">Sifarişinizi tamamlamaq üçün detalları daxil edin.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* SOL TƏRƏF: Ödəniş Formu / Nəticə Kartı */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        
                        {/* 1. Uğurlu Nəticə Ekranı */}
                        {clientSecret ? (
                            <SuccessReceiptCard 
                                total={finalTotal}
                                clientSecret={clientSecret}
                                currency={currency}
                                cartItems={cartData?.cart || []}
                            />
                        ) : (
                            /* 2. Ödəniş Formu (Əvvəlki kod) */
                            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                                <div className="p-6 sm:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-indigo-600" />
                                            Ödəniş Məlumatları
                                        </h3>
                                        <div className="flex gap-2">
                                            <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                                            <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                                            <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Valyuta Seçimi */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ödəniş Valyutası
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={currency}
                                                    onChange={(e) => setCurrency(e.target.value)}
                                                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50"
                                                >
                                                    <option value="usd">USD - ABŞ Dolları ($)</option>
                                                    <option value="eur">EUR - Avro (€)</option>
                                                    <option value="try">TRY - Türk Lirəsi (₺)</option>
                                                    <option value="azn">AZN - Azərbaycan Manatı (₼)</option>
                                                </select>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                * Kartınızdan seçdiyiniz valyuta ekvivalentində çıxılacaq.
                                            </p>
                                        </div>

                                        {/* Xəbərdarlıq */}
                                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-700">
                                                        Ödənişiniz 256-bit SSL şifrələməsi ilə qorunur. Kart məlumatlarınız serverlərimizdə saxlanılmır.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Düymələr */}
                                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="submit"
                                                disabled={loading || clientSecret}
                                                className="flex-1 flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                                        Emal edilir...
                                                    </>
                                                ) : (
                                                    `Ödənişi Başlat (${finalTotal.toFixed(2)} ${currency.toUpperCase()})`
                                                )}
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="sm:w-auto w-full px-6 py-4 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                                            >
                                                Sıfırla
                                            </button>
                                        </div>
                                    </form>

                                    {/* Xəta Mesajı */}
                                    {error && (
                                        <div className="mt-8 rounded-xl bg-red-50 p-4 border border-red-200">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-red-800">Xəta baş verdi</h3>
                                                    <div className="mt-2 text-sm text-red-700">
                                                        {error}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                        
                    </div>

                    {/* SAĞ TƏRƏF: Sifariş Xülasəsi (Dəyişmədi) */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 sticky top-6">
                            <div className="p-6 bg-gray-50/50 border-b border-gray-100 rounded-t-2xl">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-indigo-600" />
                                    Sifariş Xülasəsi
                                </h3>
                            </div>
                            
                            <div className="p-6">
                                {/* ... (Cart Data Kodu Olduğu Kimi Qalır) ... */}
                                {isCartLoading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                    </div>
                                ) : cartData && cartData.cart.length > 0 ? (
                                    <>
                                        <div className="flow-root">
                                            <ul className="-my-6 divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                {cartData.cart.map((item) => (
                                                    <li key={item.product._id} className="py-6 flex">
                                                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-gray-100">
                                                            <img
                                                                src={item.product.images?.[0]?.url || "/placeholder.svg"}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-center object-cover"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex-1 flex flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                    <h3 className="line-clamp-1 mr-2" title={item.product.name}>
                                                                        {item.product.name}
                                                                    </h3>
                                                                    <p className="ml-4 whitespace-nowrap">
                                                                        {(item.product.price * item.quantity).toFixed(2)} ₼
                                                                    </p>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                                <p className="text-gray-500">Say: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="border-t border-gray-100 mt-6 pt-6 space-y-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <p>Məhsul Dəyəri</p>
                                                <p>{totalAmount.toFixed(2)} ₼</p>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <p>Çatdırılma</p>
                                                <p>{shipping === 0 ? 'Pulsuz' : `${shipping.toFixed(2)} ₼`}</p>
                                            </div>
                                            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                                <p className="text-lg font-bold text-gray-900">Cəmi</p>
                                                <p className="text-xl font-extrabold text-indigo-600">{finalTotal.toFixed(2)} ₼</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10">
                                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">Səbətiniz boşdur.</p>
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