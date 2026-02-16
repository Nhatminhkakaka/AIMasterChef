"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createSupabaseClient } from "app/lib/supabase";
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
  const [confirmType, setConfirmType] =
    useState<"single" | "all" | null>(null)
  const [targetId, setTargetId] =
    useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // ===============================
  // LOAD DATA (FIX CHUẨN)
  // ===============================
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)

      const {
        data: { user },
        error: userError,
      } = await createSupabaseClient().auth.getUser()

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

  // ===============================
  // TOGGLE
  // ===============================
  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  // ===============================
  // DELETE ONE
  // ===============================
  const deleteOne = async (id: string) => {
    const { error } = await createSupabaseClient()
      .from("lichsu")
      .delete()
      .eq("id", id)

    if (!error) {
      setHistory((prev) =>
        prev.filter((item) => item.id !== id)
      )
    }
  }

  // ===============================
  // DELETE ALL
  // ===============================
  const deleteAll = async () => {
    const {
      data: { user },
    } = await createSupabaseClient().auth.getUser()

    if (!user) return

    const { error } = await createSupabaseClient()
      .from("lichsu")
      .delete()
      .eq("user_id", user.id)

    if (!error) {
      setHistory([])
    }
  }

  return (
    <div
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 
                 text-black dark:text-white
                 max-w-3xl mx-auto p-6 relative"
    >
      <h1 className="text-3xl font-bold mb-6">
        📜 Lịch sử món đã tạo
      </h1>

      {loading && (
        <p className="text-gray-500">Đang tải...</p>
      )}

      {!loading && history.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          Chưa có món nào.
        </p>
      )}

      {!loading && history.length > 0 && (
        <div className="mb-6 text-right">
          <button
            onClick={() => setConfirmType("all")}
            className="px-4 py-2 rounded-full 
                       bg-red-500 text-white 
                       hover:opacity-90 transition"
          >
            Xoá tất cả
          </button>
        </div>
      )}

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl shadow-md overflow-hidden
                       bg-white dark:bg-neutral-900
                       border border-neutral-200
                       dark:border-neutral-700"
          >
            <div className="flex justify-between items-center px-6 py-4">
              <button
                onClick={() => toggle(item.id)}
                className="text-left font-semibold text-lg"
              >
                {item.title}
              </button>

              <button
                onClick={() => {
                  setTargetId(item.id)
                  setConfirmType("single")
                }}
                className="text-red-500 hover:underline"
              >
                Xoá
              </button>
            </div>

            <AnimatePresence>
              {openId === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 whitespace-pre-line
                             text-gray-700 dark:text-gray-300"
                >
                  {item.content}
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* =============================== */}
      {/* MODAL CONFIRM */}
      {/* =============================== */}

      <AnimatePresence>
        {confirmType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40
                       flex items-center justify-center
                       z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-2xl p-8 w-96 text-center shadow-2xl
                         bg-white dark:bg-neutral-900
                         border border-neutral-200
                         dark:border-neutral-700"
            >
              <h2 className="text-xl font-bold mb-4">
                Bạn có chắc muốn xoá?
              </h2>

              <div className="flex justify-center gap-4">
                <button
                  onClick={async () => {
                    if (
                      confirmType === "single" &&
                      targetId
                    ) {
                      await deleteOne(targetId)
                    }

                    if (confirmType === "all") {
                      await deleteAll()
                    }

                    setConfirmType(null)
                    setTargetId(null)
                  }}
                  className="px-6 py-2 rounded-full 
                             bg-red-500 text-white"
                >
                  Đồng ý
                </button>

                <button
                  onClick={() => {
                    setConfirmType(null)
                    setTargetId(null)
                  }}
                  className="px-6 py-2 rounded-full 
                             bg-gray-300 dark:bg-neutral-700
                             dark:text-white"
                >
                  Huỷ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
