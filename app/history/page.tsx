"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createSupabaseClient } from "app/lib/supabase"
import { useRouter } from "next/navigation"

interface FoodItem {
  id: string
  title: string
  content: string
  created_at: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<FoodItem[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [confirmType, setConfirmType] = useState<"single" | "all" | null>(null)
  const [targetId, setTargetId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "atoz">("newest")
  const [toast, setToast] = useState({ show: false, message: "" })

  const router = useRouter()

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: "" }), 2500)
  }

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)

      const { data: { user }, error: userError } = await createSupabaseClient().auth.getUser()

      if (userError || !user) {
        router.push("/login")
        return
      }

      const { data, error } = await createSupabaseClient()
        .from("lichsu")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.log("Fetch history error:", error)
      } else if (data) {
        setHistory(data)
      }

      setLoading(false)
    }

    fetchHistory()
  }, [router])

  const filteredAndSorted = useMemo(() => {
    let list = history.filter((item) => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortBy === "atoz") {
      list.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return list
  }, [history, searchTerm, sortBy])

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  const deleteOne = async (id: string) => {
    const { error } = await createSupabaseClient()
      .from("lichsu")
      .delete()
      .eq("id", id)

    if (!error) {
      setHistory((prev) => prev.filter((item) => item.id !== id))
      showToast("✅ Đã xoá")
    }
  }

  const deleteAll = async () => {
    const { data: { user } } = await createSupabaseClient().auth.getUser()

    if (!user) return

    const { error } = await createSupabaseClient()
      .from("lichsu")
      .delete()
      .eq("user_id", user.id)

    if (!error) {
      setHistory([])
      showToast("✅ Đã xoá tất cả")
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <div className="h-12 bg-gray-300 dark:bg-neutral-700 rounded-lg w-2/3" />
          <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded-lg w-1/2" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div key={i} animate={{ opacity: [0.5, 1] }} transition={{ repeat: Infinity }} className="h-20 bg-gray-300 dark:bg-neutral-700 rounded-lg" />
        ))}
      </motion.div>
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
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          📜 Lịch sử món đã tạo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Xem và quản lý tất cả các tạo vị đã tạo</p>
      </div>

      {/* STATS */}
      {history.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            📊 Bạn có <span className="text-purple-600 dark:text-purple-400 font-bold">{history.length}</span> món trong lịch sử
          </p>
        </div>
      )}

      {/* SEARCH & FILTER */}
      {history.length > 0 && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:border-blue-500 outline-none transition"
          />

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSortBy("newest")} className={`px-3 py-1 rounded-full text-sm font-medium transition ${sortBy === "newest" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-neutral-800"}`}>
              🆕 Mới nhất
            </button>
            <button onClick={() => setSortBy("oldest")} className={`px-3 py-1 rounded-full text-sm font-medium transition ${sortBy === "oldest" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-neutral-800"}`}>
              📅 Cũ nhất
            </button>
            <button onClick={() => setSortBy("atoz")} className={`px-3 py-1 rounded-full text-sm font-medium transition ${sortBy === "atoz" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-neutral-800"}`}>
              🔤 A-Z
            </button>
          </div>
        </div>
      )}

      {/* ITEMS LIST */}
      {filteredAndSorted.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSorted.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-neutral-800 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center px-6 py-4 cursor-pointer" onClick={() => toggle(item.id)}>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString("vi-VN")}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setTargetId(item.id)
                    setConfirmType("single")
                  }}
                  className="ml-4 px-3 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                >
                  🗑️
                </button>
              </div>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 border-t border-gray-200 dark:border-neutral-800"
                  >
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{item.content}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 dark:bg-neutral-900 rounded-2xl"
        >
          <p className="text-6xl mb-4">📭</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{searchTerm ? "Không tìm thấy kết quả" : "Chưa có lịch sử"}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{searchTerm ? "Thử tìm kiếm từ khác" : "Các tạo vị của bạn sẽ xuất hiện ở đây"}</p>
        </motion.div>
      )}

      {/* DELETE ALL */}
      {history.length > 0 && (
        <button
          onClick={() => setConfirmType("all")}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
        >
          🗑️ Xoá tất cả lịch sử
        </button>
      )}

      {/* MODAL CONFIRM */}
      <AnimatePresence>
        {confirmType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-2xl p-8 w-96 text-center shadow-2xl bg-white dark:bg-neutral-900"
            >
              <p className="text-3xl mb-4">⚠️</p>
              <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Bạn có chắc muốn {confirmType === "all" ? "xoá tất cả" : "xoá"}?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Hành động này không thể hoàn tác</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={async () => {
                    if (confirmType === "single" && targetId) {
                      await deleteOne(targetId)
                    }
                    if (confirmType === "all") {
                      await deleteAll()
                    }
                    setConfirmType(null)
                    setTargetId(null)
                  }}
                  className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  ✓ Xoá
                </button>
                <button
                  onClick={() => {
                    setConfirmType(null)
                    setTargetId(null)
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white font-semibold transition"
                >
                  ✗ Huỷ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
