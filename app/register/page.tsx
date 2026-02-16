"use client"

import { useState } from "react"
import { createSupabaseClient } from "app/lib/supabase";
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!email || !password) return

    setLoading(true)

    const { data, error } = await createSupabaseClient().auth.signUp({
      email,
      password,
    })

    if (data.user) {
      await createSupabaseClient().from("profiles").insert({
        id: data.user.id,
        full_name: "",
        avatar_url: "",
      })
    }

    setLoading(false)

    if (!error) {
      alert("Đăng ký thành công! Hãy đăng nhập.")
      router.push("/login")
    } else {
      alert(error.message)
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
          📝 Đăng ký tài khoản
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
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-full
                     bg-gradient-to-r from-orange-500 to-pink-500
                     text-white font-semibold
                     hover:scale-105 transition
                     disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Đã có tài khoản?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-orange-600 dark:text-orange-400 font-semibold cursor-pointer hover:underline"
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  )
}
