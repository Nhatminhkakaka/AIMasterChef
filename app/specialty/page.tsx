"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { createSupabaseClient } from "app/lib/supabase"
import { useRouter } from "next/navigation"
import { provinces, Province } from "app/lib/provinces"
import SpecialtyExplorer from "../components/SpecialtyExplorer"
import SpecialtyCard from "../components/SpecialtyCard"

export default function SpecialtyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null)
  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId) || null

  // ===============================
  // CHECK AUTHENTICATION
  // ===============================
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await createSupabaseClient().auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="text-5xl">🍽️</div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
          🗺️ Khám Phá Đặc Sản Vùng Miền
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Tìm hiểu về những đặc sản nổi tiếng từ 64 tỉnh thành phố Việt Nam, kể cả Hoàng Sa và Trường Sa
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl text-center"
        >
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">64</p>
          <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Tỉnh/Thành</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 p-4 rounded-xl text-center"
        >
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">100+</p>
          <p className="text-xs text-red-700 dark:text-red-300 font-semibold">Đặc Sản</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl text-center"
        >
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">3</p>
          <p className="text-xs text-green-700 dark:text-green-300 font-semibold">Miền</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl text-center"
        >
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</p>
          <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Quần Đảo</p>
        </motion.div>
      </div>

      {/* MAIN CONTENT - TWO COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT SIDE - SEARCH & RESULTS */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            🔍 Tìm Kiếm Đặc Sản
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tìm kiếm theo tên tỉnh, thành phố hoặc tên đặc sản
          </p>
          <SpecialtyExplorer onProvinceSelect={(id) => setSelectedProvinceId(id)} />
        </motion.div>

        {/* RIGHT SIDE - DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:max-h-[85vh] overflow-y-auto"
        >
          {selectedProvince ? (
            <SpecialtyCard province={selectedProvince} />
          ) : (
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-lg h-full flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-5xl mb-4">🍽️</p>
                <p className="text-lg font-semibold">Chọn một tỉnh</p>
                <p className="text-sm">để xem thông tin chi tiết</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* QUICK FACTS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-2xl border border-amber-200 dark:border-amber-900"
      >
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">💡 Cách Sử Dụng</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">1️⃣ Tìm Kiếm:</span> Nhập tên tỉnh hoặc đặc sản vào ô tìm kiếm ở bên trái
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">2️⃣ Chọn Miền:</span> Sử dụng nút lọc theo miền để thu hẹp kết quả
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">3️⃣ Xem Chi Tiết:</span> Nhấn vào tỉnh để xem thông tin và đặc sản bên phải
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
