import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSearchProductsQuery } from "../redux/api/productsApi";
import StarRatings from "react-star-ratings";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";
  const { data: results, isLoading, isError } = useSearchProductsQuery({ query });
  const [searchInput, setSearchInput] = useState(query);
  const defaultImageUrl = "https://via.placeholder.com/300";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search-results?query=${encodeURIComponent(searchInput)}`;
  };

  if (isLoading) {
    return <div className="container mx-auto p-6 text-center text-2xl text-gray-800">Yüklənir...</div>;
  }

  if (isError) {
    return <div className="container mx-auto p-6 text-red-600 text-center text-2xl">Xəta baş verdi.</div>;
  }

  if (!results || results.products.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="flex items-center text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">HOME</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-blue-600">SHOP</Link>
        </div>
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Enter your keywords..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
          />
        </form>
        <h1 className="text-5xl font-bold text-blue-600 mb-6">Axtarış Nəticələri</h1>
        <p className="text-2xl text-gray-500">Heç bir nəticə tapılmadı.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb və Axtarış Form */}
      <div className="flex items-center text-gray-600 mb-8">
        <Link to="/" className="hover:text-blue-600">HOME</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-blue-600">SHOP</Link>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Enter your keywords..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
        />
      </form>

      <h1 className="text-5xl font-bold text-blue-600 mb-8 text-center">Axtarış Nəticələri</h1>
      <p className="text-xl text-gray-500 text-center mb-10">{results.totalProducts} nəticə tapıldı.</p>

      {/* Cədvəl Başlıqları */}
      <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-100 p-4 rounded-lg mb-6">
        <div className="col-span-6 font-semibold">PRODUCT NAME</div>
        <div className="col-span-2 font-semibold">UNIT PRICE</div>
        <div className="col-span-2 font-semibold">STOCK STATUS</div>
        <div className="col-span-2 font-semibold"></div>
      </div>

      {/* Məhsul Siyahısı */}
      <div className="space-y-6">
        {results.products.map((product) => {
          const imageUrl = product?.images?.[0]?.url || defaultImageUrl;
          return (
            <div key={product._id} className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              {/* Məhsul Şəkli və Adı */}
              <div className="col-span-12 md:col-span-6 flex items-center">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div>
                  <Link 
                    to={`/product/${product._id}`}
                    className="text-xl font-semibold hover:text-blue-600 transition-colors duration-300"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center mt-1">
                    <StarRatings
                      rating={product.ratings || 0}
                      starRatedColor="#f59e0b"
                      numberOfStars={5}
                      starDimension="18px"
                      starSpacing="1px"
                    />
                    <span className="text-sm text-gray-500 ml-2">({product.numOfReviews})</span>
                  </div>
                </div>
              </div>

              {/* Qiymət */}
              <div className="col-span-6 md:col-span-2">
                <span className="text-xl font-bold text-blue-600">
                  {product.price}₼
                </span>
              </div>

              {/* Stok Statusu */}
              <div className="col-span-6 md:col-span-2">
                <span className={`px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Səbətə Əlavə Et */}
              <div className="col-span-12 md:col-span-2">
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-400"
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;