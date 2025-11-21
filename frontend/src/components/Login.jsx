import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLoginMutation } from "../redux/api/authApi";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Loader2, Github } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.userSlice);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Zəhmət olmasa bütün sahələri doldurun");
      return;
    }

    try {
      await login({ email, password }).unwrap();
      toast.success("Giriş uğurludur!");
      navigate("/");
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err?.status === 404) {
      toast.error("Server tapılmadı (404).");
    } else if (err?.status === 401) {
      toast.error("E-poçt və ya şifrə yanlışdır.");
    } else {
      const errorMessage = err?.data?.message || err?.message || "Xəta baş verdi!";
      toast.error(errorMessage);
    }
  };

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
              Xoş Gəldiniz 👋
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hesabınıza daxil olaraq alış-verişə davam edin.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-poçt ünvanı
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                    placeholder="nümunə@mail.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifrə
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Şifrəni unutmusunuz?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Gözləyin...
                    </>
                  ) : (
                    <>
                      Daxil ol <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">və ya bunlarla davam edin</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                     <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                     <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                     <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                     <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-10.06l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                     <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  Google
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <Github className="w-5 h-5 mr-2 text-gray-900" />
                  GitHub
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Hesabınız yoxdur?{" "}
                <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Qeydiyyatdan keçin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ TƏRƏF - VİZUAL (Yalnız desktopda görünür) */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gray-900 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
          alt="Shopping Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-transparent to-transparent opacity-90"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
          <h3 className="text-4xl font-bold mb-4">Yeni kolleksiyanı kəşf edin</h3>
          <p className="text-lg text-indigo-100 max-w-md">
            Ən son dəb trendləri və eksklüziv endirimlər üçün indi daxil olun. Keyfiyyət və stilin ünvanı.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;