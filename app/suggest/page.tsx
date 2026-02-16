"use client"

import { useEffect, useState } from "react"
import { createSupabaseClient } from "app/lib/supabase";
import { useRouter } from "next/navigation"

interface FoodItem {
  id: string
  title: string
  content: string
}

export default function SuggestPage() {
  const [history, setHistory] = useState<FoodItem[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [extraIngredients, setExtraIngredients] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // ===============================
  // LOAD HISTORY FROM SUPABASE
  // ===============================
  useEffect(() => {
    const fetchHistory = async () => {
      const {
        data: { user },
      } = await createSupabaseClient().auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await createSupabaseClient()
        .from("lichsu")
        .select("id, title, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setHistory(data)
      }
    }

    fetchHistory()
  }, [router])

  // ===============================
  // HANDLE SUGGEST
  // ===============================
  const handleSuggest = async () => {
    if (!selectedId) {
      alert("Vui lòng chọn một món từ lịch sử")
      return
    }

    const selectedDish = history.find(
      (item) => item.id === selectedId
    )

    if (!selectedDish) return

    setLoading(true)
    setResult("")

    const prompt = `
Bạn là một đầu bếp sáng tạo.

Biến tấu hoặc nâng cấp món ăn sau:
${selectedDish.content}

Nguyên liệu bổ sung thêm:
${extraIngredients || "Không có"}

⚠️ QUY TẮC:
1) Dòng đầu tiên phải là:
### <Tên món mới>
2) Không viết nội dung phía trên tiêu đề.
3) Trình bày markdown:

### <Tên món mới>

## Nguyên liệu
- ...

## Cách làm
1. ...
2. ...

## Giá trị dinh dưỡng
- Khoảng xxx kcal
`

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()

    setResult(data.text)
    setLoading(false)

    // ===============================
    // LƯU MÓN MỚI VÀO SUPABASE
    // ===============================
    const titleMatch = data.text.match(/^#{1,6}\s+(.+)/m)

    const dishName = titleMatch
      ? titleMatch[1].trim()
      : "Món ăn không tên"

    const {
      data: { user },
    } = await createSupabaseClient().auth.getUser()

    if (!user) return

    await createSupabaseClient().from("lichsu").insert({
      title: dishName,
      content: data.text,
      user_id: user.id,
    })

    // reload history để dropdown cập nhật ngay
    const { data: newData } = await createSupabaseClient()
      .from("lichsu")
      .select("id, title, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (newData) {
      setHistory(newData)
    }
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300
                 bg-neutral-50 text-black
                 dark:bg-neutral-950 dark:text-white
                 max-w-3xl mx-auto p-6"
    >
      <div
        className="rounded-3xl shadow-2xl p-8
                   bg-white dark:bg-neutral-900
                   border border-neutral-200
                   dark:border-neutral-800"
      >
        <h1 className="text-4xl font-bold">
          🍳 Kitchen AI
        </h1>
        <p className="text-sm text-gray-500 center mb-6 mt-2">
          Sáng tạo món ăn từ lịch sử của bạn
        </p>
        {/* Select */}
        <div className="mb-6">
          <label className="font-semibold">
            Chọn món từ lịch sử
          </label>

          <select
            className="w-full mt-2 p-3 rounded-xl border
                       bg-white dark:bg-neutral-800
                       border-neutral-300
                       dark:border-neutral-600
                       text-black dark:text-white"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Chọn món --</option>

            {history.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <label className="font-semibold">
            Thêm nguyên liệu bổ sung (tuỳ chọn)
          </label>

          <textarea
            rows={3}
            className="w-full mt-2 p-3 rounded-xl border
                       bg-white dark:bg-neutral-800
                       border-neutral-300
                       dark:border-neutral-600
                       text-black dark:text-white
                       placeholder-gray-400
                       dark:placeholder-gray-500"
            placeholder="Ví dụ: phô mai, sốt cay, rau mầm..."
            value={extraIngredients}
            onChange={(e) =>
              setExtraIngredients(e.target.value)
            }
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSuggest}
          disabled={loading}
          className="w-full py-4 rounded-full
                     bg-gradient-to-r from-yellow-500 to-orange-500
                     text-white font-semibold shadow-lg
                     hover:scale-105 transition
                     disabled:opacity-50"
        >
          {loading ? "Đang sáng tạo..." : "Tạo món biến tấu"}
        </button>

        {/* Result */}
        {result && (
          <div
            className="mt-8 rounded-2xl shadow-lg p-6
                       bg-neutral-100 dark:bg-neutral-800
                       border border-neutral-200
                       dark:border-neutral-700
                       whitespace-pre-line"
          >
            {result}
          </div>
        )}
      </div>
    </div>
  )
}
