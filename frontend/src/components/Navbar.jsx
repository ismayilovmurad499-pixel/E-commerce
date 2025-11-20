import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/features/userSlice"
import { useGetCartQuery, useGetFavoritesQuery } from "../redux/api/productsApi"
import {
  X,
  Home,
  List,
  Smartphone,
  Laptop,
  User,
  Camera,
  Headphones,
  Gamepad,
  FileText,
  MessageCircle,
  Search,
  ShoppingCart,
  Heart
} from "lucide-react"

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.userSlice)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`)
    }
    setShowSearch(false)
  }

  const { data: cartData, isLoading: cartLoading, error: cartError } = useGetCartQuery()
  const getCartItemCount = () => {
    if (cartError || cartLoading || !cartData?.cart) return 0
    return cartData.cart.length
  }

  const { data: favoriteData, isLoading: favoriteLoading, error: favoriteError } = useGetFavoritesQuery()
  const getFavoriteItemCount = () => {
    if (favoriteError || favoriteLoading || !favoriteData?.favorites) return 0
    return favoriteData.favorites.length
  }

  const toggleMobileMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <>
      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:text-black transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </form>
            <button
              onClick={() => setShowSearch(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <nav className="bg-[#faf7f0] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Sol */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-black tracking-tight">Anvogue</span>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu} 
                className="ml-4 md:hidden p-2 text-black hover:bg-gray-100 rounded-lg"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Navigation - Orta */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-black hover:text-gray-600 transition-colors tracking-wide uppercase">
                DEMO
              </Link>
              
              <div className="relative group">
                <Link to="/shop" className="text-sm font-medium text-black hover:text-gray-600 transition-colors tracking-wide uppercase">
                  FEATURES
                </Link>
              </div>

              <Link to="/shop" className="text-sm font-medium text-black hover:text-gray-600 transition-colors tracking-wide uppercase">
                SHOP
              </Link>

              <Link to="/product" className="text-sm font-medium text-black hover:text-gray-600 transition-colors tracking-wide uppercase">
                PRODUCT
              </Link>

              <Link to="/blog" className="text-sm font-medium text-black hover:text-gray-600 transition-colors tracking-wide uppercase">
                BLOG
              </Link>

              <Link to="/pages" className="text-sm font-medium text-black hover:text-gray-600 transition-colors tracking-wide uppercase">
                PAGES
              </Link>
            </div>

            {/* Icons - Sağ */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Icon with Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="p-2 text-black hover:text-gray-600 transition-colors"
                      aria-label="User menu"
                    >
                      {user?.user?.avatar?.url ? (
                        <img
                          className="w-5 h-5 rounded-full object-cover"
                          src={user.user.avatar.url}
                          alt="User"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 border border-gray-200">
                        <p className="px-4 py-2 text-sm font-medium text-gray-900">{user.user.name}</p>
                        <p className="px-4 py-1 text-xs text-gray-500">{user.user.email}</p>
                        <hr className="my-2" />
                        {user?.user?.role === "admin" && (
                          <>
                            <Link
                              to="/admin/products"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Admin Products
                            </Link>
                            <Link
                              to="/admin/product"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Add Product
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="p-2 text-black hover:text-gray-600 transition-colors"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Favorite Icon */}
              <Link
                to="/favori"
                className="relative p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
                {getFavoriteItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {getFavoriteItemCount()}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 text-black hover:text-gray-600 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden overflow-y-auto`}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {user?.user?.avatar?.url ? (
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={user.user.avatar.url}
                    alt="User"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-black font-semibold text-lg">
                    {user?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">{user.user.name}</h2>
                  <p className="text-sm text-gray-500">{user.user.email}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-gray-400" />
                <span className="text-gray-600">Guest</span>
              </div>
            )}
          </div>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
            onClick={toggleMobileMenu}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <div className="mb-4">
            <button
              onClick={() => {
                setShowSearch(true)
                toggleMobileMenu()
              }}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg flex items-center gap-3 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Search products...</span>
            </button>
          </div>

          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                onClick={toggleMobileMenu}
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </li>
            
            <li>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                <div className="flex items-center gap-3">
                  <List className="w-5 h-5" />
                  Categories
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryOpen && (
                <ul className="ml-8 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/phones"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <Smartphone className="w-4 h-4" />
                      Phones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/computers"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <Laptop className="w-4 h-4" />
                      Computers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/smart-watches"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <User className="w-4 h-4" />
                      Smart Watches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cameras"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <Camera className="w-4 h-4" />
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/headphones"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <Headphones className="w-4 h-4" />
                      Headphones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/gaming"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      <Gamepad className="w-4 h-4" />
                      Gaming
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/about"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                onClick={toggleMobileMenu}
              >
                <FileText className="w-5 h-5" />
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                onClick={toggleMobileMenu}
              >
                <MessageCircle className="w-5 h-5" />
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {isAuthenticated && (
          <div className="p-4 border-t mt-auto">
            {user?.user?.role === "admin" && (
              <>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Admin Products
                </Link>
                <Link
                  to="/admin/product"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Add Product
                </Link>
              </>
            )}
            <button
              onClick={() => {
                handleLogout()
                toggleMobileMenu()
              }}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar