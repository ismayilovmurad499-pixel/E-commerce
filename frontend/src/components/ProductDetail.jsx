"use client" // Bu faylın müştəri tərəfində işlədiləcəyini göstərir.

import { useState } from "react" 
// React-də komponentin vəziyyətini (state) idarə etmək üçün useState hook-u istifadə olunur.

import { useParams } from "react-router-dom" 
// useParams hook-u vasitəsilə URL-dəki parametrlərə (məsələn, məhsul id-si) daxil ola bilərik.

// Aşağıdakı API hook-ları məhsul haqqında məlumat almaq, məhsulu səbətə və ya favorilərə əlavə etmək,
// və həmçinin rəy göndərmək və rəy məlumatlarını çəkmək üçün istifadə olunur.
import {
  useGetProductDetailsQuery,
  useAddToCartMutation,
  useAddToFavoritesMutation,
  useCreateOrUpdateReviewMutation,
  useGetProductReviewsQuery,
} from "../redux/api/productsApi"

// Lucide-react kitabxanasından müxtəlif ikonlar idxal edilir.
// Bu ikonlar interfeys üzərində vizual elementlər kimi istifadə olunur.
import {
  Smartphone,
  Cpu,
  Grid,
  Camera,
  CameraIcon,
  Battery,
  Shield,
  MemoryStick,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// İstifadəçiyə bildiriş (toast) göstərmək üçün react-hot-toast kitabxanası idxal olunur.
import { toast, Toaster } from "react-hot-toast"

// İstifadəçi rəylərini ulduzlarla göstərmək üçün StarRatings komponenti idxal olunur.
import StarRatings from "react-star-ratings"

const ProductDetail = () => {
  // URL-dəki parametrləri əldə edirik (məsələn, məhsul id-si)
  const params = useParams()

  // API vasitəsilə məhsulun detallı məlumatlarını çəkmək üçün useGetProductDetailsQuery hook-u çağırılır.
  // params.id dəyəri ilə konkret məhsulun məlumatları alınır.
  const { data, isLoading, error } = useGetProductDetailsQuery(params?.id, {
    refetchOnMountOrArgChange: true, // Komponent mount olduqda və ya parametrlər dəyişdikdə məlumatlar yenidən çəkilir.
  })
  const product = data?.product // API-dən gələn məlumatdan məhsul obyektini götürürük.

  // Eyni zamanda, həmin məhsul üçün yazılmış rəyləri çəkmək üçün useGetProductReviewsQuery hook-u istifadə olunur.
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } =
    useGetProductReviewsQuery(params?.id, { refetchOnMountOrArgChange: true })

  // Aşağıdakı mutation hook-ları vasitəsilə məhsulu səbətə, favorilərə əlavə etmək və rəy göndərmək həyata keçirilir.
  const [addToCart] = useAddToCartMutation()
  const [addToFavorites] = useAddToFavoritesMutation()
  const [createOrUpdateReview] = useCreateOrUpdateReviewMutation()

  // Məhsul şəkil qalereyasında hazırda göstərilən şəkilin indeksini saxlamaq üçün state.
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // Rəy göndərərkən seçilən ulduz sayı (rating) üçün state.
  const [reviewRating, setReviewRating] = useState(0)
  // Rəy mətni üçün state.
  const [reviewComment, setReviewComment] = useState("")

  // Məhsulun şəkillərini əldə edirik; əgər şəkil yoxdursa boş array kimi qəbul edilir.
  const productImages = product?.images || []
  // Hazırda göstəriləcək şəkilin URL-sini təyin edirik. 
  // Əgər şəkillər varsa, currentImageIndex-ə əsaslanaraq uyğun şəkil göstərilir,
  // yoxdursa, standart (placeholder) şəkil istifadə olunur.
  const productImageUrl =
    productImages.length > 0
      ? productImages[currentImageIndex].url
      : "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"

  // "Sepətə əlavə et" düyməsinə kliklənəndə çağırılan funksiya.
  const handleAddToCart = async (e) => {
    e.preventDefault() // Formanın default submit hərəkətini maneə törədək.
    try {
      // API üzərindən məhsulu səbətə əlavə edirik.
      await addToCart({
        productId: product._id, // Əlavə olunacaq məhsulun id-si.
        quantity: 1, // Əlavə olunan məhsul sayı (burada sabit olaraq 1).
      }).unwrap() // unwrap metodu ilə cavabı alırıq.
      toast.success("Məhsul səbətə əlavə edildi") // Uğurlu əməliyyatdan sonra bildiriş göstərilir.
    } catch (error) {
      // Əgər xəta baş verərsə, istifadəçiyə xəta barədə məlumat verilir.
      toast.error("Məhsul səbətə əlavə edilərkən xəta baş verdi")
    }
  }

  // "Favorilərə əlavə et" düyməsinə kliklənəndə çağırılan funksiya.
  const handleAddToFavorites = async (e) => {
    e.preventDefault()
    try {
      // Məhsulu favorilərə əlavə etmək üçün API çağırışı edilir.
      const result = await addToFavorites(product._id).unwrap()
      if (result.success) {
        toast.success("Məhsul favorilərə əlavə edildi")
      }
    } catch (error) {
      // Xəta mesajı alınır və əgər məhsul artıq favorilərdədirsə, bu barədə istifadəçi məlumatlandırılır.
      const message =
        error.data?.message || "Məhsul favorilərə əlavə edilərkən xəta baş verdi"
      if (
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("already exists")
      ) {
        toast("Bu məhsul artıq favorilərinizdədir", {
          icon: "ℹ️",
        })
      } else {
        toast.error(message)
      }
    }
  }

  // Şəkillər arasında gəzmək üçün funksiya.
  // "prev" (əvvəlki) və "next" (növbəti) istiqamətlərinə görə currentImageIndex yenilənir.
  const handleImageNavigation = (direction) => {
    if (direction === "prev") {
      // Əgər əvvəlki şəkilə keçmək istəyiriksə,
      // cari indeks sıfırdadırsa, sonuncu şəkilə keçir.
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
      )
    } else {
      // Növbəti şəkilə keçmək istəyiriksə,
      // cari indeks sonuncu şəkildirsə, yenidən ilk şəkilə keçir.
      setCurrentImageIndex((prevIndex) =>
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      )
    }
  }

  // Məhsulun kateqoriyasına əsaslanaraq, fərqli xüsusiyyətlər (specs) siyahısını qaytaran funksiya.
  // Hər kateqoriya üçün fərqli məlumatlar göstərilir.
  const getSpecs = () => {
    if (!product) return [] // Əgər məhsul məlumatı yoxdursa, boş array qaytar.
    switch (product.category) {
      case "Phones":
        return [
          { label: "Screen Size", value: product.screenSize },
          { label: "Storage", value: product.storage },
          { label: "RAM", value: product.ram },
          { label: "Front Camera", value: product.frontCamera },
          { label: "Back Camera", value: product.backCamera },
          { label: "Battery", value: product.battery },
          { label: "Processor", value: product.processor },
          { label: "OS", value: product.operatingSystem },
        ]
      case "Laptops":
        return [
          { label: "Screen Size", value: product.screenSize },
          { label: "Storage", value: product.storage },
          { label: "RAM", value: product.ram },
          { label: "GPU", value: product.gpu },
          { label: "Camera", value: product.camera },
          { label: "Processor", value: product.processor },
          { label: "Battery Life", value: product.batteryLife },
          { label: "OS", value: product.operatingSystem },
        ]
      case "Cameras":
        return [
          { label: "Resolution", value: product.resolution },
          { label: "Optical Zoom", value: product.opticalZoom },
          { label: "Sensor Type", value: product.sensorType },
          { label: "Image Stabilization", value: product.imageStabilization },
        ]
      case "Headphones":
        return [
          { label: "Connectivity", value: product.connectivity },
          { label: "Battery Life", value: product.batteryLife },
          { label: "Noise Cancellation", value: product.noiseCancellation },
        ]
      case "Console":
        return [
          { label: "CPU", value: product.cpu },
          { label: "GPU", value: product.gpu },
          { label: "Storage", value: product.storage },
          { label: "Memory", value: product.memory },
          { label: "Supported Resolution", value: product.supportedResolution },
          { label: "Connectivity", value: product.connectivity },
          // controllerIncluded boolean dəyər olduğu üçün "Yes" və ya "No" kimi göstərilir.
          { label: "Controller Included", value: product.controllerIncluded ? "Yes" : "No" },
        ]
      case "iPad":
        return [
          { label: "Screen Size", value: product.ipadScreenSize },
          { label: "Storage", value: product.ipadStorage },
          { label: "RAM", value: product.ipadRam },
          { label: "Battery", value: product.ipadBattery },
          { label: "Processor", value: product.ipadProcessor },
          { label: "OS", value: product.ipadOperatingSystem },
          { label: "Camera", value: product.ipadCamera },
          { label: "Cellular", value: product.cellular ? "Yes" : "No" },
        ]
      default:
        return [] // Dəstəklənməyən kateqoriyalar üçün boş array qaytar.
    }
  }

  // İstifadəçinin rəy göndərmə prosesini idarə edən funksiya.
  // Form təqdim edildikdə (submit) çağırılır.
  const handleReviewSubmit = async (e) => {
    e.preventDefault() // Formun səhifəni yeniləməsinin qarşısını alır.
    // Əgər istifadəçi heç ulduz seçməyibsə, xəta mesajı göstərilir.
    if (reviewRating === 0) {
      toast.error("Zəhmət olmasa, ulduzla rəy verin")
      return
    }
    try {
      // API vasitəsilə rəy göndərilir və ya mövcud rəy yenilənir.
      const response = await createOrUpdateReview({
        productId: product._id, // Rəy yazılacaq məhsulun id-si
        rating: reviewRating,   // İstifadəçinin seçdiyi ulduz sayı
        comment: reviewComment, // İstifadəçinin yazdığı rəy mətni
      }).unwrap()
      toast.success(response.message || "Rəy uğurla göndərildi")
    } catch (err) {
      // Əgər rəy göndərilərkən xəta baş verərsə, istifadəçiyə xəbər verilir.
      toast.error(err.data?.message || "Rəy göndərilərkən xəta baş verdi")
    }
    // Rəy göndərildikdən sonra input sahələri sıfırlanır.
    setReviewRating(0)
    setReviewComment("")
  }

  // Əgər məhsul məlumatları yüklənirsə, istifadəçiyə yüklənir animasiyası göstərilir.
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    )

  // Əgər məhsul məlumatlarını çəkmək zamanı xəta baş verərsə, xəta mesajı göstərilir.
  if (error)
    return (
      <div className="text-center text-red-600 text-xl">
        Xəta: {error.message}
      </div>
    )

  // Əsas render olunan hissə: məhsulun şəkli, məlumatları, və interaktiv düymələri göstərilir.
  return (
    // Səhifənin əsas konteyneri: py-16 ilə üfüqi boşluq, bg-white (ağ fon), min-h-screen ilə tam ekran hündürlük.
    <>
    <section className="py-16 bg-white md:py-20 antialiased min-h-screen">
      {/* react-hot-toast vasitəsilə istifadəçiyə bildirişlər göstərmək üçün Toaster komponenti */}
      <Toaster />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Böyük ekranlarda iki sütunlu layout: sol tərəfdə məhsul şəkli, sağ tərəfdə məhsul məlumatları */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 xl:gap-28 mt-8">
          {/* Sol sütun: Məhsul şəkli və qalereya */}
          <div className="mx-auto py-12">
            <div className="relative group">
              {/* Məhsulun əsas şəklini göstərən konteyner */}
              <div className="shrink-0 max-w-sm lg:max-w-md mx-auto relative overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 ease-in-out transform hover:scale-105 border-4 border-yellow-500">
                <img
                  src={productImageUrl || "/placeholder.svg"} 
                  // Məhsulun şəkili varsa onu, yoxdursa placeholder istifadə olunur.
                  alt={product?.name || "Məhsul Şəkli"} 
                  // Şəkil üçün alternativ mətn.
                  className="w-full rounded-3xl object-cover transition-transform duration-500 ease-in-out"
                />
                {/* Əgər məhsulun birdən çox şəkili varsa, əvvəlki və növbəti düymələr göstərilir */}
                {productImages.length > 1 && (
                  <>
                    {/* Əvvəlki şəkilə keçid düyməsi */}
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    {/* Növbəti şəkilə keçid düyməsi */}
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              {/* Şəkillərin kiçik önizləmə (thumbnail) hissəsi */}
              {productImages.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      // Hər thumbnail klikləndikdə currentImageIndex uyğun olaraq yenilənir.
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-yellow-500 shadow-lg scale-105"
                          : "border-transparent hover:border-yellow-500/50"
                      }`}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Önizləmə ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ sütun: Məhsulun məlumatları, təsviri, düymələr və rəy bölməsi */}
          <div className="mt-8 lg:mt-0 bg-white rounded-3xl shadow-2xl p-10">
            {/* Məhsulun adı */}
            <h1 className="text-5xl font-bold text-black mb-4 leading-tight font-serif">
              {product?.name || "Məhsulun Adı"}
            </h1>
            {/* Məhsulun ümumi qiymətləndirməsi və stok məlumatları */}
            <div className="flex items-center gap-2 mt-2">
              <StarRatings
                rating={product?.ratings || 0} // Məhsulun orta ulduz dəyəri.
                starRatedColor="gold" // Dolu ulduzların rəngi.
                numberOfStars={5} // Cəmi ulduz sayı.
                starDimension="18px" // Ulduz ölçüsü.
                starSpacing="4px" // Ulduzlar arasındakı boşluq.
              />
              <span className="text-sm text-black">
                ({product?.ratings || "Qiymətləndirmə yoxdur"})
              </span>
              <p className="text-sm text-black mt-1">
                {product?.stock
                  ? `Stokda: ${product?.stock} ədəd`
                  : "Stokda yoxdur"}
              </p>
            </div>

            {/* Məhsulun qiyməti */}
            <div className="flex items-baseline gap-6 mb-8">
              <span className="text-5xl font-bold text-black">
                {product?.price || "N/A"}{" "}
                <span className="text-yellow-500">&#8380;</span> 
                {/* Türk Lirası simvolu */}
              </span>
            </div>

            {/* Məhsulun xüsusiyyətlərini (specs) göstərən bölmə */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {getSpecs().map((spec, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  {/* Xüsusiyyətin adı */}
                  <div className="flex items-center gap-2 mb-2">
                    {/* 
                      Burada istəsəniz müvafiq ikonlardan istifadə edə bilərsiniz.
                      Hazırda yalnız mətn olaraq göstərilir.
                    */}
                    <span className="text-sm text-black">{spec.label}</span>
                  </div>
                  {/* Xüsusiyyətin dəyəri */}
                  <p className="font-medium text-black">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Məhsulun təsviri */}
            <p className="mb-8 text-black leading-relaxed">
              {product?.description || "Təsvir mövcud deyil."}
            </p>

            {/* Səbətə və favorilərə əlavə etmə düymələri */}
            <div className="flex gap-4 mb-8">
              {/* Favorilərə əlavə et düyməsi */}
              <button
                onClick={handleAddToFavorites}
                className="flex-1 px-6 py-3 border-2 border-black text-black rounded-xl hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Heart className="w-5 h-5" /> {/* Ürəklər ikonu */}
                Favorilərə Əlavə Et
              </button>
              {/* Səbətə əlavə et düyməsi */}
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-gray-200 text-black rounded-xl hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" /> {/* Səbət ikonu */}
                Səbətə Əlavə Et
              </button>
            </div>

            {/* Rəy yazma formu */}
            <div className="mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-black mb-4">
                Rəyinizi Yazın
              </h2>
              <form onSubmit={handleReviewSubmit}>
                {/* İstifadəçinin ulduz seçimi üçün interaktiv ulduzlar */}
                <div className="flex items-center">
                  <StarRatings
                    rating={reviewRating} // İstifadəçinin seçdiyi ulduz sayı.
                    changeRating={setReviewRating} // Ulduzlara kliklənildikdə state yenilənir.
                    numberOfStars={5}
                    starRatedColor="gold"
                    starHoverColor="gold"
                    starDimension="24px"
                    starSpacing="4px"
                    isSelectable={true} // Ulduzların kliklənə bilən olması təmin olunur.
                  />
                </div>
                {/* Rəy mətni üçün textarea */}
                <div className="mt-4">
                  <textarea
                    value={reviewComment} // İstifadəçinin daxil etdiyi rəy mətni.
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Rəyinizi buraya yazın..."
                    className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows={4} // Mətn sahəsinin hündürlüyü.
                  ></textarea>
                </div>
                {/* Rəyi göndərmə düyməsi */}
                <button
                  type="submit"
                  className="mt-4 w-full px-6 py-3 bg-gray-200 text-black rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  Rəyi Göndər
                </button>
              </form>
            </div>

            {/* Məhsul rəylərinin göstərildiyi bölmə */}
            <div className="mt-10 bg-gray-100 p-6 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-black mb-4">
                Məhsul Rəyləri
              </h2>
              {reviewsLoading ? (
                // Rəylər yüklənərkən göstərilən mesaj.
                <p className="text-black">Rəylər yüklənir...</p>
              ) : reviewsError ? (
                // Rəylər çəkilərkən xəta baş verərsə göstərilən mesaj.
                <p className="text-red-500">Rəylər yüklənərkən xəta baş verdi.</p>
              ) : reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                // Əgər rəylər varsa, hər bir rəy ayrıca göstərilir.
                reviewsData.reviews.map((review, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <StarRatings
                        rating={review.rating} // Rəyin ulduz dəyəri.
                        starRatedColor="gold"
                        numberOfStars={5}
                        starDimension="16px"
                        starSpacing="2px"
                      />
                      <span className="ml-2 text-black">{review.rating}</span>
                    </div>
                    {/* Rəy mətni */}
                    <p className="mt-2 text-black">{review.comment}</p>
                  </div>
                ))
              ) : (
                // Əgər heç bir rəy yoxdursa, bu mesaj göstərilir.
                <p className="text-black">Bu məhsul üçün hələ rəy yoxdur.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default ProductDetail
