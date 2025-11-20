import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../redux/api/authApi'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [err, setErr] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [register, { isLoading, error, isSuccess }] = useRegisterMutation()
  const navigate = useNavigate()

  useEffect(() => {
    const clearForm = () => {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      setErr("")
    }
    clearForm()
    return () => clearForm()
  }, [])

  useEffect(() => {
    if (isSuccess) {
      navigate('/')
    }
  }, [isSuccess, navigate])

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
      setErr("Şifreler uygun deyil")
      return
    }
    setErr('')
    try {
      await register(formData).unwrap()
    } catch (err) {
      setErr(error?.data?.message || 'Sorgu gönderilirken hata oluştu')
    }
  }

  const EyeIcon = ({ show, toggle }) => (
    <svg
      onClick={toggle}
      className={`w-5 h-5 cursor-pointer transition-colors ${
        show ? 'text-gray-600' : 'text-gray-400'
      } hover:text-gray-800`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
    >
      {show ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.88l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  )

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Hesap Oluştur
            </h1>
            <p className="mt-2 text-gray-500">
              Zaten hesabınız var mı?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Giriş yapın
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tam Adınız
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız ve soyadınız"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@mail.com"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <div className="absolute right-3 bottom-3">
                  <EyeIcon 
                    show={showPassword} 
                    toggle={() => setShowPassword(!showPassword)} 
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre Tekrarı
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <div className="absolute right-3 bottom-3">
                  <EyeIcon 
                    show={showConfirmPassword} 
                    toggle={() => setShowConfirmPassword(!showConfirmPassword)} 
                  />
                </div>
              </div>
            </div>

            {err && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Hesap oluşturuluyor...</span>
                </div>
              ) : (
                'Hesap Oluştur'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register