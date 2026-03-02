"use client"

import { useState } from "react"
import { createSupabaseClient } from "app/lib/supabase";
import { useRouter } from "next/navigation"
import { useToast } from "app/components/ToastProvider"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { push } = useToast()

  const handleLogin = async () => {
    if (!email || !password) {
      push("Email và mật khẩu không được để trống")
      return
    }

    // simple email format check
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRegex.test(email)) {
      push("Email không hợp lệ")
      return
    }

    setLoading(true)

    const { error } = await createSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (!error) {
      push("Đăng nhập thành công")
      router.push("/")
    } else {
      push(error.message)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center
                 transition-colors duration-300
                 bg-neutral-50 text-black
                 dark:bg-neutral-950 dark:text-white"
    >
      <div
        className="w-96 p-8 rounded-3xl shadow-2xl
                   bg-white/80 dark:bg-neutral-900/80
                   backdrop-blur-xl
                   border border-neutral-200
                   dark:border-neutral-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          🔐 Đăng nhập
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl border
                     bg-white dark:bg-neutral-800
                     border-neutral-300
                     dark:border-neutral-600
                     placeholder-gray-400
                     dark:placeholder-gray-500
                     focus:ring-2 focus:ring-orange-400
                     outline-none"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-xl border
                     bg-white dark:bg-neutral-800
                     border-neutral-300
                     dark:border-neutral-600
                     placeholder-gray-400
                     dark:placeholder-gray-500
                     focus:ring-2 focus:ring-orange-400
                     outline-none"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-full
                     bg-gradient-to-r from-orange-500 to-pink-500
                     text-white font-semibold
                     hover:scale-105 transition
                     disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-orange-600 dark:text-orange-400 font-semibold cursor-pointer hover:underline"
          >
            Đăng ký
          </span>
        </p>
        <p className="text-center mt-2 text-xs text-gray-400">
          <span className="cursor-pointer hover:underline" onClick={() => push("Liên hệ admin để đặt lại mật khẩu")}>Quên mật khẩu?</span>
        </p>
      </div>
    </div>
  )
}
