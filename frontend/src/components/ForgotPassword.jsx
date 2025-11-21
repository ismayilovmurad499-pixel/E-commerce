"use client"

import { useState } from "react"
import { useForgotPasswordMutation } from "../redux/api/authApi"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const result = await forgotPassword({ email }).unwrap()
      toast.success("Şifrə sıfırlama linki emailinizə göndərildi!")
      console.log("Forgot password request successful", result)
    } catch (err) {
      toast.error(err.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
      console.error("Forgot password request failed", err)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      <div className="w-full max-w-md p-10 bg-white/10 backdrop-blur-3xl rounded-2xl shadow-2xl border border-white/30 transform transition duration-500 hover:scale-105">
        <h1 className="mb-6 text-4xl font-extrabold text-center text-black">
          Forgot your password?
        </h1>
        <p className="mb-8 text-center text-lg text-black-200">
          Don't fret! Just type in your email and we will send you a code to reset your password!
        </p>

        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-black-100">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="mt-2 w-full px-4 py-3 rounded-full bg-white/60 border border-white/40  focus:outline-none focus:ring-4 focus:ring-indigo-500 transition duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 text-white font-semibold transition ease-in-out duration-300 shadow-lg"
          >
            {isLoading ? "Göndərilir..." : "Şifrəmi Sıfırla"}
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  )
}

export default ForgotPassword
