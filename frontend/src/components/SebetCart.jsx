"use client"

import { useState } from "react"
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartQuantityMutation } from "../redux/api/productsApi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Gift, CreditCard, Loader2 } from "lucide-react"

const SebetCart = () => {
  const { data: cartData, isLoading, error } = useGetCartQuery()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [updateQuantity] = useUpdateCartQuantityMutation()
  const [discountCode, setDiscountCode] = useState("")
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

  const calculateTotal = () => {
    if (!cartData?.cart) return 0
    return cartData.cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const subtotal = calculateTotal()
  const tax = Math.round(subtotal * 0.02 * 100) / 100
  const shipping = subtotal > 100 ? 0 : 29 // Məsələn, 100 AZN-dən yuxarı çatdırılma pulsuz olsun
  const total = subtotal + tax + shipping

  const handleDiscountApply = () => {
    if (!discountCode) return
    setIsApplyingDiscount(true)
    setTimeout(() => {
      toast.success(`${discountCode} endirim kodu tətbiq olundu!`)
      setIsApplyingDiscount(false)
      setDiscountCode("")
    }, 1500)
  }

  const handleQuantityChange = async (productId, currentQuantity, stock, change) => {
    const newQuantity = currentQuantity + change

    if (newQuantity < 1 || newQuantity > stock) {
      toast.error(newQuantity < 1 ? "Minimum say 1 olmalıdır" : "Stokda kifayət qədər məhsul yoxdur")
      return
    }

    try {
      await updateQuantity({ productId, quantity: newQuantity }).unwrap()
      toast.success("Səbət yeniləndi")
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
      toast.success("Məhsul silindi")
    } catch (error) {
      toast.error("Silinmə zamanı xəta baş verdi")
    }
  }

  // Loading Ekranı - Daha sadə və mərkəzləşmiş
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Səbətiniz yüklənir...</p>
      </div>
    )
  }

  // Boş Səbət və ya Xəta Ekranı
  if (error || !cartData?.cart?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Səbətiniz Boşdur</h2>
          <p className="text-gray-500 mb-8 text-lg">Hələ heç nə əlavə etməmisiniz. Mağazamıza göz atın və bəyəndiyiniz məhsulları seçin.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-indigo-200"
          >
            Alış-verişə Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Başlıq Hissəsi */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Səbət</h1>
            <p className="text-gray-500 mt-2">Səbətinizdə <span className="font-semibold text-indigo-600">{cartData.cart.length}</span> məhsul var</p>
          </div>
          <Link to="/shop" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 transition-colors">
            Alış-verişə davam et <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Məhsul Siyahısı (Sol Tərəf) */}
          <div className="lg:col-span-8 space-y-6">
            {cartData.cart.map((item) => (
              <div
                key={item.product._id}
                className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-center sm:items-start"
              >
                {/* Şəkil */}
                <Link to={`/product/${item.product._id}`} className="shrink-0 relative overflow-hidden rounded-xl w-32 h-32 bg-gray-100">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.product.images?.[0]?.url || "/placeholder.svg"}
                    alt={item.product.name}
                  />
                </Link>

                {/* Məlumatlar */}
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-6">
                  <div className="space-y-2 text-center sm:text-left">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">Kateqoriya: {item.product.category || "Ümumi"}</p>
                    <div className="text-indigo-600 font-bold text-lg sm:hidden">
                      {(item.product.price * item.quantity).toFixed(2)} ₼
                    </div>
                  </div>

                  {/* İdarəetmə Paneli */}
                  <div className="flex flex-col items-center sm:items-end gap-4">
                    <div className="text-xl font-bold text-gray-900 hidden sm:block">
                      {(item.product.price * item.quantity).toFixed(2)} ₼
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Sayğac */}
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, item.product.stock, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity, item.product.stock, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:bg-gray-100 active:scale-95 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Sil Düyməsi */}
                      <button
                        onClick={() => handleRemoveFromCart(item.product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sifariş İcmalı (Sağ Tərəf - Sticky) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:sticky lg:top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Sifariş İcmalı
              </h3>

              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                  <span>Məhsullar</span>
                  <span className="font-medium text-gray-900">{subtotal.toFixed(2)} ₼</span>
                </div>
                <div className="flex justify-between">
                  <span>Çatdırılma</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? "Pulsuz" : `${shipping.toFixed(2)} ₼`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vergi (2%)</span>
                  <span className="font-medium text-gray-900">{tax.toFixed(2)} ₼</span>
                </div>

                <div className="border-t border-dashed border-gray-200 my-4 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900">Cəmi Ödəniləcək</span>
                    <span className="text-2xl font-extrabold text-indigo-600">{total.toFixed(2)} ₼</span>
                  </div>
                </div>
              </div>

              {/* Endirim Kodu */}
              <div className="mt-8">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Endirim kodu</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Kodu daxil edin"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onClick={handleDiscountApply}
                    disabled={isApplyingDiscount || !discountCode}
                    className="px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isApplyingDiscount ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tətbiq et"}
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/payment" className="block mt-8">
                <button className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2">
                  Sifarişi Rəsmiləşdir
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">Təhlükəsiz ödəniş zəmanəti</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default SebetCart