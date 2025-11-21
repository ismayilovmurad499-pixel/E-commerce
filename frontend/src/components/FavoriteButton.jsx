import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation, productApi } from "../redux/api/productsApi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Heart, Trash2, ShoppingBag, ArrowRight, AlertCircle, ShoppingCart, ArrowLeft } from "lucide-react"

const FavoriteButton = () => { // Qeyd: Komponentin adı "FavoritesPage" olsa daha uyğun olar, amma sizin kodunuz pozulmasın deyə saxladım.
  const dispatch = useDispatch()
  const {
    data: favoriteData,
    isLoading,
    refetch,
  } = useGetFavoritesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [removeFromFavorites] = useRemoveFromFavoritesMutation()
  const [localFavorites, setLocalFavorites] = useState([])

  useEffect(() => {
    if (favoriteData?.favorites) {
      setLocalFavorites(favoriteData.favorites)
    } else {
      setLocalFavorites([])
    }
  }, [favoriteData])

  const handleRemoveFromFavorites = async (e, productId) => {
    e.preventDefault(); // Link-ə keçidin qarşısını almaq üçün
    try {
      await removeFromFavorites(productId).unwrap()
      setLocalFavorites((prev) => prev.filter((item) => item._id !== productId))
      toast.success("Məhsul favorilərdən silindi")
      dispatch(productApi.util.invalidateTags(["Favorites"]))
      await refetch()
    } catch (error) {
      toast.error("Xəta baş verdi")
    }
  }

  // Loading Ekranı
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Favorilər yüklənir...</p>
      </div>
    )
  }

  // Boş Səhifə Ekranı
  if (!localFavorites || localFavorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-red-500 fill-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Favoriləriniz Boşdur</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Bəyəndiyiniz məhsulları yadda saxlamaq üçün ürək ikonuna klikləyin.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center w-full bg-gray-900 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-300"
          >
            <ShoppingBag className="mr-2 w-5 h-5" />
            Mağazaya Keç
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gray-50 min-h-screen py-12 font-sans">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Başlıq Hissəsi */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Favorilər <Heart className="text-red-500 fill-red-500 w-8 h-8" />
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Siyahınızda <span className="font-bold text-gray-900">{localFavorites.length}</span> məhsul var
            </p>
          </div>
          
          <Link
            to="/shop"
            className="group flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Alış-verişə davam et
          </Link>
        </div>

        {/* Grid Sistemi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {localFavorites.map((product) => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Şəkil Sahəsi */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0]?.url || "/default-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Silmə Düyməsi (Absolute) */}
                <button
                  onClick={(e) => handleRemoveFromFavorites(e, product._id)}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm text-gray-400 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all duration-200 z-10"
                  title="Favorilərdən sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Stok Badge */}
                {product.stock < 5 && product.stock > 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center shadow-sm">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Son {product.stock}
                  </div>
                )}
                 {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                     <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-bold">Bitib</span>
                  </div>
                )}
              </div>

              {/* Məlumat Sahəsi */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-extrabold text-indigo-600">
                      {product.price.toFixed(2)} ₼
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through decoration-gray-400">
                        {product.oldPrice.toFixed(2)} ₼
                      </span>
                    )}
                  </div>
                </div>

                {/* Aksiyon Düyməsi */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full py-3 px-4 bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Məhsula Bax</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FavoriteButton