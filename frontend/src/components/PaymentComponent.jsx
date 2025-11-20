// src/components/PaymentComponent.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent, resetPaymentState } from '../slices/paymentSlice';
import { useGetCartQuery } from '../redux/api/productsApi';

const PaymentComponent = () => {
  const dispatch = useDispatch();
  const { loading, clientSecret, error } = useSelector((state) => state.payment);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();

  // Valyuta forması üçün state
  const [currency, setCurrency] = useState('usd'); // Əsasən usd istifadə olunur

  // Səbətdəki məhsulların cəmi məbləğini hesablamaq
  const calculateTotal = () => {
    if (!cartData?.cart) return 0;
    return cartData.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const totalAmount = calculateTotal();

  // Ödəniş intenti yaratmaq üçün formun göndərilməsi
  const handleSubmit = (e) => {
    e.preventDefault();
    // Diqqət: Məbləğ ən kiçik valyuta vahidi (məsələn, cent/kuruş) şəklində verilməlidir.
    // Əgər qiymətləriniz tam vahiddədirsə, lazım gələrsə totalAmount * 100 istifadə edin.
    dispatch(createPaymentIntent({ amount: totalAmount, currency }));
  };

  const handleReset = () => {
    dispatch(resetPaymentState());
    setCurrency('usd');
  };

  // PaymentIntent uğurlu yarandıqdan sonra form məlumatlarını sıfırlamaq üçün useEffect
  useEffect(() => {
    if (clientSecret) {
      // 3 saniyə sonra sıfırlamaq (bu müddəti öz ehtiyacınıza görə tənzimləyə bilərsiniz)
      const timer = setTimeout(() => {
        handleReset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clientSecret]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Ödəniş Səhifəsi</h2>

      {/* Səbət Xülasəsi */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Səbətiniz</h3>
        {isCartLoading ? (
          <p>Yüklənir...</p>
        ) : cartData && cartData.cart.length > 0 ? (
          <div className="space-y-4">
            {cartData.cart.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center">
                  <img
                    src={item.product.images?.[0]?.url || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Miqdar: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {(item.product.price * item.quantity).toFixed(2)}₼
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-end">
              <p className="text-xl font-bold">
                Ümumi: {totalAmount.toFixed(2)}₼
              </p>
            </div>
          </div>
        ) : (
          <p>Səbətiniz boşdur.</p>
        )}
      </div>

      {/* Ödəniş Formu */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Ödəniş</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Valyuta:</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="usd, eur, try və s."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Yüklənir...' : 'Ödənişi Başlat'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Sıfırla
            </button>
          </div>
        </form>
      </div>

      {/* Payment Intent Nəticəsi */}
      {clientSecret && (
        <div className="mt-6 p-4 border border-green-300 bg-green-50 rounded">
          <h3 className="text-lg font-semibold text-green-800">
            Payment Intent Client Secret:
          </h3>
          <p className="text-green-700 break-all">{clientSecret}</p>
          {/* Gələcəkdə burada Stripe Elements və ya digər ödəniş vasitələri inteqrasiyası üçün əlavə payment kodları əlavə olunacaq */}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded">
          <h3 className="text-lg font-semibold text-red-800">Xəta:</h3>
          <p className="text-red-700 break-all">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentComponent;
