import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../redux/api/authApi'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [register, { isLoading, isSuccess, error }] = useRegisterMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      toast.success("Hesab uğurla yaradıldı! Yönləndirilirsiniz...");
      setTimeout(() => navigate('/login'), 1500);
    }
    if (error) {
        toast.error(error?.data?.message || "Qeydiyyat zamanı xəta baş verdi");
    }
  }, [isSuccess, error, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error("Şifrələr eyni deyil")
      return
    }
    
    try {
      await register(formData).unwrap()
    } catch (err) {
      // Error useEffect-də idarə olunur
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* SOL TƏRƏF - FORMA */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 xl:w-[40%] z-10 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Logo və Başlıq */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-8">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">E</div>
              <span>E-Ticarət</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
              Yeni Hesab Yaradın 🚀
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bütün imkanlardan yararlanmaq üçün qeydiyyatdan keçin.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Ad Soyad Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad və Soyad
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                    placeholder="Adınız"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-poçt ünvanı
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                    placeholder="nümunə@mail.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifrə
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifrənin Təkrarı
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Qeydiyyat gedir...
                    </>
                  ) : (
                    <>
                      Qeydiyyatı Tamamla <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Artıq hesabınız var?{" "}
                <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Giriş edin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ TƏRƏF - VİZUAL (Yalnız desktopda görünür) */}
      <div className="hidden lg:block relative w-0 flex-1 bg-indigo-900 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop"
          alt="Register Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 opacity-90"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <div className="max-w-xl">
            <h3 className="text-4xl font-bold mb-6 leading-tight">Bizə Qoşulun və İmkanlardan Yararlanın</h3>
            <ul className="space-y-4 text-lg text-indigo-100">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-6 h-6" />
                Eksklüziv endirimlər və kampaniyalar
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-6 h-6" />
                Sürətli və təhlükəsiz çatdırılma
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-6 h-6" />
                24/7 Müştəri dəstəyi
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Register