"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "app/lib/supabase";

export default function AIPage() {
  const [ingredients, setIngredients] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const animationRef = useRef<number | null>(null)
  const router = useRouter()

  // ===============================
  // Progress animation
  // ===============================
  useEffect(() => {
    if (!loading) return

    setProgress(0)

    const animate = () => {
      setProgress((prev) => {
        if (prev >= 92) return prev
        return prev + (92 - prev) * 0.02
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [loading])

  // ===============================
  // HANDLE GENERATE
  // ===============================
  const handleGenerate = async () => {
    if (!ingredients.trim()) return

    try {
      // 🔥 LẤY USER ĐÚNG CÁCH
      const {
        data: { user },
        error: userError,
      } = await createSupabaseClient().auth.getUser()

      if (userError || !user) {
        router.push("/login")
        return
      }

      setLoading(true)
      setResult("")

      const advanced = JSON.parse(
        localStorage.getItem("advancedOptions") || "{}"
      )

      let advancedPrompt = ""

      if (advanced.level && advanced.level !== "Bất kỳ")
        advancedPrompt += `Độ khó: ${advanced.level}\n`

      if (advanced.category && advanced.category !== "Bất kỳ")
        advancedPrompt += `Loại món: ${advanced.category}\n`

      if (advanced.maxTime)
        advancedPrompt += `Thời gian tối đa: ${advanced.maxTime} phút\n`

      if (advanced.targetCalories)
        advancedPrompt += `Calo mục tiêu: khoảng ${advanced.targetCalories} kcal\n`

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `
Bạn là một đầu bếp chuyên nghiệp.

Tạo một món ăn Việt từ các nguyên liệu:
${ingredients}

Yêu cầu thêm:
${advancedPrompt}

⚠️ QUY TẮC:
1) Dòng đầu tiên phải là:
### <Tên món>
2) Không viết mô tả phía trên tiêu đề.
3) Trình bày markdown chuẩn.
4) Cố gắng sử dụng nguyên liệu đã cho, nhưng có thể thêm 1-2 nguyên liệu nếu cần thiết để món ăn ngon hơn.
5) Nếu không thể tạo món ăn ngon từ nguyên liệu đã cho, hãy tạo món ăn đơn giản nhất có thể.
6) KHÔNG ĐƯỢC TẠO RA MÓN ĂN KHÔNG THỰC TẾ, PHẢI LÀ MÓN ĂN CÓ THẬT VÀ CÓ THỂ NẤU ĐƯỢC.
7) KHÔNG ĐƯỢC TẠO RA MÓN ĂN CHỈ DÙNG CHO TRẺ EMHOẶC LÀ NGƯỜI ĂN KIÊNG, PHẢI LÀ MÓN ĂN MỌI NGƯỜI ĐỀU CÓ THỂ THƯỞNG THỨC.
8) KHÔNG ĐƯỢC TẠO RA MÓN ĂN CHỈ CÓ TÔI MỚI BIẾT, PHẢI LÀ MÓN ĂN PHỔ BIẾN MÀ NHIỀU NGƯỜI BIẾT ĐẾN.
9) NẾU KHÔNG THỂ TẠO TỪ NHỮNG MÓN ĂN ĐÃ CÓ, HÃY LÀM MÓN NHƯ BÌNH THƯỜNG VÀ CHO BIẾT NHỮNG NGUYÊN LIỆU CÒN THIẾU VÀ GIÁ TIỀN TRUNG BÌNH CỦA NHỮNG NGUYÊN LIỆU CÒN THIẾU ẤY.
`,
        }),
      })

      if (!res.ok) {
      const errorText = await res.text()
      console.log("API error detail:", errorText)
      throw new Error(errorText)
    }

      const data = await res.json()

      setProgress(100)

      setTimeout(async () => {
        setLoading(false)

        if (!data.text) {
          setResult("❌ Không nhận được kết quả từ AI.")
          return
        }

        setResult(data.text)

        const titleMatch = data.text.match(/^#{1,6}\s+(.+)/m)
        const dishName = titleMatch
          ? titleMatch[1].trim()
          : "Món ăn không tên"

        // 🔥 INSERT CHUẨN RLS
        const { error: insertError } = await createSupabaseClient()
          .from("lichsu")
          .insert({
            title: dishName,
            content: data.text,
            user_id: user.id,
          })

        if (insertError) {
          console.log(
            "FULL INSERT ERROR:",
            JSON.stringify(insertError, null, 2)
          )
        }
      }, 400)

    } catch (err) {
      console.error(err)
      setLoading(false)
      setResult("❌ Đã xảy ra lỗi khi tạo món ăn.")
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white max-w-3xl mx-auto relative p-6">
      <div className="rounded-3xl p-8 shadow-2xl relative z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-3xl font-bold mb-6">
          🤖 Sáng tạo món ăn bằng AI
        </h2>

        <textarea
          rows={4}
          className="w-full p-4 rounded-xl border bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-orange-400"
          placeholder="Nhập nguyên liệu..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <div className="flex justify-between items-center mt-4">
          <Link
            href="/advanced"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
          >
            ⚙️ Gợi ý nâng cao
          </Link>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "AI đang nấu..." : "Tạo món ăn"}
          </button>
        </div>

        {result && (
          <div className="mt-8 whitespace-pre-line p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            {result}
          </div>
        )}
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-3xl z-20 p-10"
          >
            <motion.img
              src="/robot-cooking.gif"
              alt="Robot cooking"
              className="w-72 mb-8"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />

            <div className="w-full max-w-md">
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>

              <p className="text-center mt-3 font-semibold">
                {Math.floor(progress)}%
              </p>
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Robot đang chế biến món ăn...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
