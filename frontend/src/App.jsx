import './App.css'
import "flowbite"
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import Register from './components/Register'
import { Toaster } from 'react-hot-toast'
import ProductDetail from './components/ProductDetail'
import AddProducts from './components/admin/AddProducts'
import AdminProducts from './components/admin/AdminProduct'
import EditProduct from './components/admin/EditProduct'
import SearchResults from './components/SearchResults'
import NotFound from './pages/NotFound'
import Introduction from './components/Introduction'
import SebetCart from './components/SebetCart'
import Categories from './components/Categories'
import Footer from './components/Footer'
import Kadın from './pages/Kadın'
import FavoriteButton from './components/FavoriteButton'
import Shop from './pages/Shop'
import Cameras from './components/Cameras'
import Food from './components/Food'
import Headphones from './components/Headphones'
import Laptops from './components/Laptops'
import PrivateRoute from './components/PrivateRoute'
import ResetPassword from './components/ResetPassword'
import EcommerceApp from './components/EcommerceApp'
import Phones from './components/Phones'
import About from './pages/About'
import Contact from './pages/Contact'
import Computers from './components/Computer'
import PaymentComponent from './components/PaymentComponent'
import Sever from './components/Sever'
import Testimonials from './components/Testimonials'
import Blog from './components/Blog'
function App() {
  return (
    <>
    <BrowserRouter>
    <Toaster position='top-center'/>
    <Navbar/>
    <Routes>
    <Route path="/search-results" element={<SearchResults />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/product/:id" element={<ProductDetail/>}/>
      <Route path="*" element={<NotFound/>} />
      <Route path="/" element={<Introduction/>} />
      <Route path="/cartsebet" element={<SebetCart/>} />
      <Route path="/catoria" element={<Categories/>} />
      <Route path="/cart" element={<SebetCart/>} />
      <Route path="/kadin" element={<Kadın/>} />
      <Route path="/favori" element={<FavoriteButton/>} />
      <Route path="/camera" element={<Cameras/>} />
      <Route path="/food" element={<Food/>} />
      <Route path="/headphones" element={<Headphones/>} />
      <Route path="/laptop" element={<Laptops/>} />
      <Route path="/shop" element={<EcommerceApp/>} />
      <Route path="/phones" element={<Phones/>} />
      <Route path="/computer" element={<Computers/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/payment" element={<PaymentComponent/>} />
      <Route path="/sever" element={<Sever/>} />
      <Route path="/Testimonials" element={<Testimonials/>} />
      <Route path="/Blog" element={<Blog/>} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />



      <Route path="/admin/products" element={<PrivateRoute>
        <AddProducts />
      </PrivateRoute>} />
      <Route path="/admin/product" element={<PrivateRoute>
        <AdminProducts />
      </PrivateRoute>} />
      <Route path='/admin/edit-product/:id' element={
        <PrivateRoute>
          <EditProduct />
        </PrivateRoute>
      } />
    </Routes>
    <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
