import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "../redux/api/productsApi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { productApi } from "../redux/api/productsApi"

const FavoriteButton = () => {
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

  const handleRemoveFromFavorites = async (productId) => {
    try {
      await removeFromFavorites(productId).unwrap()
      setLocalFavorites((prev) => prev.filter((item) => item._id !== productId))
      toast.success("Məhsul favorilərdən silindi")

      // Invalidate the cache for favorites
      dispatch(productApi.util.invalidateTags(["Favorites"]))

      // Refetch the favorites
      await refetch()
    } catch (error) {
      toast.error("Məhsul silinərkən xəta baş verdi")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    )
  }

  if (!localFavorites || localFavorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
        <div className="text-center space-y-6">
          <i className="fas fa-heart text-6xl text-gray-400"></i>
          <h2 className="text-4xl font-extrabold text-gray-200">Favori Siyahınız Boşdur</h2>
          <p className="text-xl text-gray-400">Hələ heç bir məhsul əlavə etməmisiniz.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-600 text-white px-8 py-4 rounded-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-out"
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            Alış-verişə Başla
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gradient-to-b from-gray-100 to-gray-300 py-12 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Favori Məhsullarım
            <span className="ml-2 text-2xl text-gray-600">({localFavorites.length} məhsul)</span>
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center transform transition-all duration-300 ease-out hover:scale-105"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Alış-verişə Davam Et
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {localFavorites.map((product) => (
            <div
              key={product._id}
              className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 ease-in-out overflow-hidden transform hover:scale-105"
            >
              <div className="relative">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0]?.url || "/default-product.jpg"}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/default-product.jpg"
                    }}
                  />
                </Link>
                <button
                  onClick={() => handleRemoveFromFavorites(product._id)}
                  className="absolute top-3 right-3 p-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full shadow-xl hover:bg-red-600 hover:scale-110 transition-all duration-300"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
                {product.stock < 5 && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-300 to-yellow-600 text-white rounded-full text-sm font-semibold shadow-xl transform translate-y-2 group-hover:translate-y-0">
                    Son {product.stock} ədəd
                  </div>
                )}
              </div>

              <div className="p-6 bg-gradient-to-b from-white to-gray-50 rounded-b-3xl">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-indigo-500 transition-all duration-300 ease-in-out line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold text-gradient text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700">
                      {product.price.toFixed(2)} ₼
                    </p>
                    {product.oldPrice && (
                      <p className="text-sm text-gray-600 line-through">{product.oldPrice.toFixed(2)} ₼</p>
                    )}
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg transform transition-all duration-300 ease-out hover:bg-blue-600 hover:scale-105"
                  >
                    <span>Ətraflı</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FavoriteButton

