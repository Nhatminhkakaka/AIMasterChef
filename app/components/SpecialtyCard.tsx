"use client"

import { Province } from "app/lib/provinces"
import { motion } from "framer-motion"

interface SpecialtyCardProps {
  province: Province
}

export default function SpecialtyCard({ province }: SpecialtyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Card Container */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
        {/* Header với Gradient Background */}
        <div className="relative h-32 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 text-8xl animate-pulse">🍽️</div>
            <div className="absolute bottom-0 right-0 text-8xl">🥘</div>
          </div>
          <div className="relative h-full flex items-center px-6">
            <div>
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                {province.name}
              </h2>
              <p className="text-white/90 text-sm mt-1">{province.printName}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Region Badge */}
          <div className="flex items-center gap-3">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold">
              📍 {province.region}
            </span>
            <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-semibold">
              🎯 {province.specialties.length} Đặc sản
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              Giới thiệu
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
              {province.description}
            </p>
          </div>

          {/* Specialties Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span>🍲</span>
              <span>Các Đặc Sản Nổi Tiếng</span>
            </h3>

            <div className="space-y-3">
              {province.specialties.map((specialty, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className="group p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl border-l-4 border-orange-400 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <span className="text-2xl mt-1 group-hover:scale-125 transition transform">
                      {specialty.emoji || "🍽️"}
                    </span>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm md:text-base">
                        {specialty.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {specialty.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-400">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>Mẹo Du Lịch Ẩm Thực</span>
            </h4>
            <ul className="text-xs md:text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>✓ Hãy tìm những quán ăn địa phương khi tới {province.shortName}</li>
              <li>✓ Nên thử {province.specialties[0]?.name || "các đặc sản"} vào buổi sáng</li>
              <li>✓ Mang về làm quà cho bạn bè và gia đình</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-200 dark:border-neutral-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ✨ Khám phá nền ẩm thực phong phú của {province.shortName} • Cập nhật lần cuối: 2026
          </p>
        </div>
      </div>
    </motion.div>
  )
}
