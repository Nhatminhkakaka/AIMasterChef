"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { provinces } from "app/lib/provinces"
import { createSupabaseClient } from "app/lib/supabase"

interface SpecialtyExplorerProps {
  onProvinceSelect?: (provinceId: string) => void
  userId?: string | null
}

export default function SpecialtyExplorer({ onProvinceSelect, userId }: SpecialtyExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" })

  const regions = ["Miền Bắc", "Miền Trung", "Miền Nam", "Hải Đảo"]

  const supabase = createSupabaseClient()

  // derive list of all emojis used by specialties; allow user to filter by type
  const emojiOptions = useMemo(() => {
    const set = new Set<string>()
    provinces.forEach((p) => {
      p.specialties.forEach((s) => {
        if (s.emoji) set.add(s.emoji)
      })
    })
    return Array.from(set)
  }, [])

  // load favorites from Supabase when userId becomes available
  useEffect(() => {
    if (!userId) return
    const fetch = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("province_id")
        .eq("user_id", userId)
      if (!error && data) {
        setFavorites(data.map((r: any) => r.province_id))
      }
    }
    fetch()
  }, [userId])

  const toggleFavorite = async (id: string) => {
    if (!userId) return
    const exists = favorites.includes(id)
    if (exists) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("province_id", id)
      setFavorites(favorites.filter((x) => x !== id))
      showToast("Đã bỏ yêu thích")
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: userId, province_id: id })
      setFavorites([...favorites, id])
      showToast("Đã thêm vào yêu thích")
    }
  }

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: "" }), 2000)
  }

  const filteredProvinces = useMemo(() => {
    const term = searchTerm.toLowerCase()
    let list = provinces.filter((province) => {
      const matchSearch =
        province.name.toLowerCase().includes(term) ||
        province.shortName.toLowerCase().includes(term) ||
        province.specialties.some((s) => s.name.toLowerCase().includes(term))

      const matchRegion = selectedRegion === null || province.region === selectedRegion
      const matchEmoji =
        selectedEmoji === null || province.specialties.some((s) => s.emoji === selectedEmoji)

      return matchSearch && matchRegion && matchEmoji
    })

    // sort favorites to top
    if (favorites.length) {
      list.sort((a, b) => {
        const ai = favorites.indexOf(a.id)
        const bi = favorites.indexOf(b.id)
        if (ai === -1 && bi === -1) return 0
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })
    }

    return list
  }, [searchTerm, selectedRegion, selectedEmoji, favorites])

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

        {/* suggestion dropdown */}
        {searchTerm && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-md max-h-40 overflow-auto">
            {provinces
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.shortName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(0, 5)
              .map((p) => (
                <li
                  key={p.id}
                  onClick={() => {
                    setSearchTerm(p.name)
                    onProvinceSelect?.(p.id)
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {p.name}
                </li>
              ))}
          </ul>
        )}
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
      {/* Emoji Filter Buttons */}
      <div className="flex gap-2 flex-wrap mt-2">
        {emojiOptions.map((emo) => (
          <motion.button
            key={emo}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedEmoji(selectedEmoji === emo ? null : emo)}
            className={`px-2 py-1 rounded-md text-sm font-medium transition ${
              selectedEmoji === emo
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {emo}
          </motion.button>
        ))}
      </div>

      {/* Result Count / actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          📊 Tìm thấy <span className="text-orange-500 dark:text-orange-400 font-bold">{filteredProvinces.length}</span> kết quả
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedRegion(null)
              setSelectedEmoji(null)
            }}
            className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
          >
            ✖️ Xóa bộ lọc
          </button>
          <button
            onClick={() => {
              if (filteredProvinces.length > 0) {
                const rand = filteredProvinces[Math.floor(Math.random() * filteredProvinces.length)]
                onProvinceSelect?.(rand.id)
              }
            }}
            className="text-xs text-orange-500 hover:underline"
            disabled={filteredProvinces.length === 0}
          >
            🎲 Ngẫu nhiên
          </button>
        </div>
      </div>

      {/* Favorites list */}
      {favorites.length > 0 && (
        <div className="">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">❤️ Danh sách yêu thích</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {favorites.map((id) => {
              const p = provinces.find((x) => x.id === id)
              if (!p) return null
              return (
                <button
                  key={id}
                  onClick={() => onProvinceSelect?.(id)}
                  className="px-3 py-1 bg-orange-100 dark:bg-orange-800 rounded-full text-sm text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-700 transition"
                >
                  {p.name}
                </button>
              )
            })}
          </div>
        </div>
      )}



      {/* Results Grid */}
      {filteredProvinces.length > 0 ? (
        <>
          {/* trending/top row (hidden when user has favorites) */}
          {!favorites.length && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {filteredProvinces.slice(0,5).map((province) => (
                <button
                  key={province.id}
                  onClick={() => onProvinceSelect?.(province.id)}
                  className="flex-shrink-0 px-3 py-1 bg-white dark:bg-neutral-900 rounded-full shadow hover:shadow-lg transition text-sm"
                >
                  {province.name}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProvinces.map((province, idx) => (
              <motion.div
                key={province.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onProvinceSelect?.(province.id)}
                className="w-full text-left p-3 bg-white dark:bg-neutral-900 
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

              {/* favorite star */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(province.id)
                }}
                className="absolute top-2 right-2 text-xl"
              >
                {favorites.includes(province.id) ? "⭐" : "☆"}
              </button>
            </motion.div>
          ))}
          </div>
        </>
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

      {/* toast message */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg">
          {toast.message}
        </div>
      )}
    </motion.div>
  )
}
