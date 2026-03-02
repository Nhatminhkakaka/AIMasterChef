"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { provinces } from "app/lib/provinces"

interface SpecialtyExplorerProps {
  onProvinceSelect?: (provinceId: string) => void
}

export default function SpecialtyExplorer({ onProvinceSelect }: SpecialtyExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const regions = ["Miền Bắc", "Miền Trung", "Miền Nam", "Hải Đảo"]

  const filteredProvinces = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return provinces.filter((province) => {
      const matchSearch =
        province.name.toLowerCase().includes(term) ||
        province.shortName.toLowerCase().includes(term) ||
        province.specialties.some((s) => s.name.toLowerCase().includes(term))

      const matchRegion = selectedRegion === null || province.region === selectedRegion

      return matchSearch && matchRegion
    })
  }, [searchTerm, selectedRegion])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Tìm tỉnh, thành phố hoặc đặc sản..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-12 
                     bg-white dark:bg-neutral-900
                     border-2 border-gray-300 dark:border-neutral-700
                     rounded-xl focus:outline-none focus:border-orange-500
                     dark:focus:border-orange-400
                     placeholder-gray-400 dark:placeholder-gray-600
                     transition"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {regions.map((region) => (
          <motion.button
            key={region}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              selectedRegion === region
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {region === 'Miền Bắc' && '⬆️'} {region === 'Miền Trung' && '➡️'} {region === 'Miền Nam' && '⬇️'} {region === 'Hải Đảo' && '🏝️'} {" " + region}
          </motion.button>
        ))}
      </div>

      {/* Result Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        📊 Tìm thấy <span className="text-orange-500 dark:text-orange-400 font-bold">{filteredProvinces.length}</span> kết quả
      </div>



      {/* Results Grid */}
      {filteredProvinces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProvinces.map((province, idx) => (
            <motion.button
              key={province.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onProvinceSelect?.(province.id)}
              className="text-left p-3 bg-white dark:bg-neutral-900 
                         border-2 border-gray-200 dark:border-neutral-800
                         rounded-lg hover:border-orange-400 dark:hover:border-orange-300
                         transition cursor-pointer"
            >
              <p className="font-bold text-gray-800 dark:text-gray-200">{province.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{province.shortName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  {province.region}
                </span>
                {province.region === "Hải Đảo" && (
                  <span className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-1 rounded">
                    🏝️ Quần Đảo
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          <p className="text-lg">😕</p>
          <p>Không tìm thấy kết quả</p>
          <p className="text-xs">Thử tìm kiếm từ khác</p>
        </motion.div>
      )}
    </motion.div>
  )
}
