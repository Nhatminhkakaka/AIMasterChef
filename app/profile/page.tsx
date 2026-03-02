"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { createSupabaseClient } from "app/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ full_name: "", avatar_url: "" })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "" })
  const [stats, setStats] = useState({ favorites: 0, history: 0 })

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: "" }), 3000)
  }

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await createSupabaseClient().auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUserId(user.id)

      const { data } = await createSupabaseClient()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      const userProfile = { email: user.email, ...data }
      setProfile(userProfile)
      setEditData({ full_name: userProfile.full_name || "", avatar_url: userProfile.avatar_url || "" })

      // fetch stats
      const [favRes, histRes] = await Promise.all([
        createSupabaseClient().from("favorites").select("id", { count: "exact" }).eq("user_id", user.id),
        createSupabaseClient().from("lichsu").select("id", { count: "exact" }).eq("user_id", user.id),
      ])

      setStats({
        favorites: favRes.count || 0,
        history: histRes.count || 0,
      })
    }

    getProfile()
  }, [router])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    const { error } = await createSupabaseClient()
      .from("profiles")
      .update(editData)
      .eq("id", userId)

    if (!error) {
      setProfile({ ...profile, ...editData })
      setIsEditing(false)
      showToast("✅ Lưu thành công!")
    } else {
      showToast("❌ Lỗi khi lưu")
    }
    setSaving(false)
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <motion.div animate={{ opacity: [0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-40 bg-gray-300 dark:bg-neutral-700 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-6 bg-gray-300 dark:bg-neutral-700 rounded w-1/3" />
          <div className="h-6 bg-gray-300 dark:bg-neutral-700 rounded w-2/3" />
        </div>
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          👤 Hồ Sơ Của Bạn
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Quản lý thông tin cá nhân và tùy chỉnh hồ sơ</p>
      </div>

      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={editData.avatar_url || "/avatar.png"}
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-lg"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition">
                📷
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setEditData({ ...editData, avatar_url: event.target?.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Info */}
          {!isEditing ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile.full_name || "Chưa đặt tên"}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{profile.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition"
              >
                ✏️ Chỉnh sửa
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm space-y-4">
              <input
                type="text"
                placeholder="Họ tên"
                value={editData.full_name}
                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2 rounded-lg transition"
                >
                  {saving ? "Đang lưu..." : "💾 Lưu"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditData({ full_name: profile.full_name || "", avatar_url: profile.avatar_url || "" })
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition"
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-xl text-center"
        >
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">❤️</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-2">{stats.favorites}</p>
          <p className="text-sm text-orange-600 dark:text-orange-400">Tỉnh yêu thích</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl text-center"
        >
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">📜</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2">{stats.history}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">Lịch sử xem</p>
        </motion.div>
      </div>

      {/* QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4"
      >
        <button
          onClick={() => router.push("/settings")}
          className="bg-white dark:bg-neutral-900 p-4 rounded-xl hover:shadow-lg transition border-2 border-gray-200 dark:border-neutral-700"
        >
          <p className="text-2xl mb-2">⚙️</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">Cài đặt</p>
        </button>
        <button
          onClick={() => router.push("/history")}
          className="bg-white dark:bg-neutral-900 p-4 rounded-xl hover:shadow-lg transition border-2 border-gray-200 dark:border-neutral-700"
        >
          <p className="text-2xl mb-2">📜</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">Lịch sử</p>
        </button>
      </motion.div>

      {/* TOAST */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 bg-black/80 text-white px-4 py-3 rounded-lg shadow-lg"
        >
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  )
}

