"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import {
  useGetProductDetailsQuery,
  useAddToCartMutation,
  useAddToFavoritesMutation,
  useCreateOrUpdateReviewMutation,
  useGetProductReviewsQuery,
} from "../redux/api/productsApi"

import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react"

import { toast, Toaster } from "react-hot-toast"
import StarRatings from "react-star-ratings"

const ProductDetail = () => {
  const params = useParams()

  const { data, isLoading, error } = useGetProductDetailsQuery(params?.id, {
    refetchOnMountOrArgChange: true,
  })
  const product = data?.product

  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } =
    useGetProductReviewsQuery(params?.id, { refetchOnMountOrArgChange: true })

  const [addToCart] = useAddToCartMutation()
  const [addToFavorites] = useAddToFavoritesMutation()
  const [createOrUpdateReview] = useCreateOrUpdateReviewMutation()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")

  const productImages = product?.images || []
  const productImageUrl =
    productImages.length > 0
      ? productImages[currentImageIndex].url
      : "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"

  const handleAddToCart = async (e) => {
    e.preventDefault()
    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
      }).unwrap()
      toast.success("Məhsul səbətə əlavə edildi")
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  const handleAddToFavorites = async (e) => {
    e.preventDefault()
    try {
      const result = await addToFavorites(product._id).unwrap()
      if (result.success) {
        toast.success("Favorilərə əlavə edildi")
      }
    } catch (error) {
      const message = error.data?.message || "Xəta baş verdi"
      if (message.toLowerCase().includes("already")) {
        toast("Bu məhsul artıq favorilərdədir", { icon: "ℹ️" })
      } else {
        toast.error(message)
      }
    }
  }

  const handleImageNavigation = (direction) => {
    if (direction === "prev") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
      )
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      )
    }
  }

  const getSpecs = () => {
    if (!product) return []
    switch (product.category) {
      case "Phones":
        return [
          { label: "Ekran", value: product.screenSize },
          { label: "Yaddaş", value: product.storage },
          { label: "RAM", value: product.ram },
          { label: "Ön Kamera", value: product.frontCamera },
          { label: "Arxa Kamera", value: product.backCamera },
          { label: "Batareya", value: product.battery },
          { label: "Prosessor", value: product.processor },
          { label: "OS", value: product.operatingSystem },
        ]
      case "Laptops":
        return [
          { label: "Ekran", value: product.screenSize },
          { label: "Yaddaş SSD", value: product.storage },
          { label: "RAM", value: product.ram },
          { label: "Videokart", value: product.gpu },
          { label: "Kamera", value: product.camera },
          { label: "Prosessor", value: product.processor },
          { label: "Batareya", value: product.batteryLife },
          { label: "OS", value: product.operatingSystem },
        ]
        // Digər kateqoriyalar eyni qaydada qala bilər...
      default:
        return []
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (reviewRating === 0) {
      toast.error("Zəhmət olmasa ulduz seçin")
      return
    }
    try {
      const response = await createOrUpdateReview({
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment,
      }).unwrap()
      toast.success(response.message || "Rəy göndərildi")
      setReviewRating(0)
      setReviewComment("")
    } catch (err) {
      toast.error(err.data?.message || "Xəta baş verdi")
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 gap-4">
        <AlertCircle size={48} />
        <p className="text-xl font-semibold">Xəta: {error.message}</p>
      </div>
    )

  return (
    <section className="py-10 bg-gray-50 min-h-screen font-sans text-gray-800">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- MƏHSUL BLOKU --- */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            
            {/* SOL TƏRƏF: Şəkil Qalereyası */}
            <div className="p-8 bg-gray-100/50 flex flex-col justify-center">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200 group">
                <img
                  src={productImageUrl}
                  alt={product?.name}
                  className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                />
                
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex justify-center mt-6 gap-3 overflow-x-auto py-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-yellow-500 ring-2 ring-yellow-200 ring-offset-2"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumb ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SAĞ TƏRƏF: Məlumatlar */}
            <div className="p-8 lg:p-12 flex flex-col">
              {/* Kateqoriya Badge */}
              <span className="inline-block w-fit px-3 py-1 text-xs font-semibold tracking-wider text-yellow-800 uppercase bg-yellow-100 rounded-full mb-4">
                {product?.category || "Elektronika"}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product?.name}
              </h1>

              {/* Reytinq və Stok */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 font-bold text-lg">{product?.ratings || 0}</span>
                  <StarRatings
                    rating={product?.ratings || 0}
                    starRatedColor="#EAB308" // Tailwind yellow-500
                    numberOfStars={5}
                    starDimension="18px"
                    starSpacing="2px"
                  />
                </div>
                <span className="text-gray-300">|</span>
                <div className={`flex items-center gap-2 text-sm font-medium ${product?.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product?.stock > 0 ? (
                    <><CheckCircle size={16} /> Stokda var ({product?.stock})</>
                  ) : (
                    <><AlertCircle size={16} /> Bitib</>
                  )}
                </div>
              </div>

              {/* Qiymət */}
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  {product?.price} <span className="text-2xl text-gray-500">AZN</span>
                </span>
              </div>

              {/* Təsvir */}
              <p className="text-gray-600 leading-relaxed mb-8 text-lg border-b border-gray-100 pb-8">
                {product?.description || "Məhsul haqqında məlumat yoxdur."}
              </p>

              {/* Düymələr */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingCart size={20} />
                  Səbətə At
                </button>
                <button
                  onClick={handleAddToFavorites}
                  className="sm:w-auto w-full px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                >
                  <Heart size={20} />
                </button>
              </div>

              {/* Xüsusiyyətlər (Specs) */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Texniki Göstəricilər</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                  {getSpecs().length > 0 ? (
                    getSpecs().map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500">{spec.label}</span>
                        <span className="font-medium text-gray-900 text-right">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">Göstərici yoxdur.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- RƏYLƏR BLOKU --- */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          
          {/* Sol: Rəy Yazma Formu */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rəy Bildirin</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qiymətləndirmə</label>
                  <StarRatings
                    rating={reviewRating}
                    changeRating={setReviewRating}
                    numberOfStars={5}
                    starRatedColor="#EAB308"
                    starHoverColor="#EAB308"
                    starDimension="24px"
                    starSpacing="4px"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şərhiniz</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Məhsul haqqında fikirləriniz..."
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none h-32 text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors shadow-md"
                >
                  Rəyi Göndər
                </button>
              </form>
            </div>
          </div>

          {/* Sağ: Mövcud Rəylər */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">İstifadəçi Rəyləri</h3>
            
            {reviewsLoading ? (
              <div className="text-center py-10 text-gray-500">Yüklənir...</div>
            ) : reviewsError ? (
              <div className="text-red-500">Rəyləri gətirmək mümkün olmadı.</div>
            ) : reviewsData?.reviews?.length > 0 ? (
              <div className="grid gap-4">
                {reviewsData.reviews.map((review, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                    {/* Avatar Placeholder */}
                    <div className="shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User size={24} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">İstifadəçi</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < review.rating ? "currentColor" : "none"} 
                              className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
                <p>Bu məhsul üçün hələ heç kim rəy yazmayıb. İlk siz olun!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductDetail