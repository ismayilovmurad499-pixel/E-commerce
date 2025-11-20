"use client"

import { useState } from "react"
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartQuantityMutation } from "../redux/api/productsApi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Gift } from "lucide-react"

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
  const shipping = 29
  const total = subtotal + tax + shipping

  const handleDiscountApply = () => {
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
      toast.error(newQuantity < 1 ? "Məhsul sayı 1-dən az ola bilməz" : "Kifayət qədər stok yoxdur")
      return
    }

    try {
      await updateQuantity({ productId, quantity: newQuantity }).unwrap()
      toast.success("Məhsul sayı yeniləndi")
    } catch (error) {
      toast.error("Miqdar yenilənərkən xəta baş verdi")
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
      toast.success("Məhsul səbətdən silindi")
    } catch (error) {
      toast.error("Məhsul silinərkən xəta baş verdi")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-white text-2xl font-semibold">Yüklənir...</div>
      </div>
    )
  }

  if (error || !cartData?.cart?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <ShoppingBag className="w-24 h-24 mx-auto text-blue-600 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Səbətiniz Boşdur</h2>
          <p className="text-gray-600 mb-8">Alış-verişə başlamaq üçün mağazamıza göz atın.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Alış-verişə Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Səbətim</h2>
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold">
            {cartData.cart.length} Məhsul
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {cartData.cart.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Link to={`/product/${item.product._id}`} className="shrink-0">
                    <div className="w-32 h-32 overflow-hidden rounded-lg">
                      <img
                        className="w-full h-full object-cover"
                        src={item.product.images?.[0]?.url || "/placeholder.svg"}
                        alt={item.product.name}
                      />
                    </div>
                  </Link>
                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="text-xl font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className="flex items-center border rounded-full">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.product._id, item.quantity, item.product.stock, -1)
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product._id, item.quantity, item.product.stock, 1)}
                            className="h-8 w-8 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                          {(item.product.price * item.quantity).toFixed(2)}₼
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.product._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-8 h-fit bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Sifariş Detalları</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Məhsullar</span>
                <span className="font-medium text-gray-900">{subtotal.toFixed(2)}₼</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Çatdırılma</span>
                <span className="font-medium text-gray-900">{shipping.toFixed(2)}₼</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Vergi (2%)</span>
                <span className="font-medium text-gray-900">{tax.toFixed(2)}₼</span>
              </div>
              <hr className="my-4 border-gray-300" />
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-900">Ümumi</span>
                <span className="text-blue-600">{total.toFixed(2)}₼</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Endirim Kodu"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleDiscountApply}
                    disabled={isApplyingDiscount || !discountCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplyingDiscount ? (
                      <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <Gift className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <Link to="/payment">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                  Təhliləsiz Ödəniş Et
                </button>
                </Link>
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/shop"
                  className="text-lg font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  Alış-verişə davam et
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SebetCart

