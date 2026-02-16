"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdvancedPage() {
  const router = useRouter()

  const [level, setLevel] = useState("Bất kỳ")
  const [category, setCategory] = useState("Bất kỳ")
  const [maxTime, setMaxTime] = useState("")
  const [targetCalories, setTargetCalories] = useState("")

  // Load dữ liệu đã lưu
  useEffect(() => {
    const saved = localStorage.getItem("advancedOptions")
    if (saved) {
      const data = JSON.parse(saved)
      setLevel(data.level || "Bất kỳ")
      setCategory(data.category || "Bất kỳ")
      setMaxTime(data.maxTime || "")
      setTargetCalories(data.targetCalories || "")
    }
  }, [])

  const handleSave = () => {
    const data = {
      level,
      category,
      maxTime,
      targetCalories,
    }

    localStorage.setItem("advancedOptions", JSON.stringify(data))
    router.push("/ai")
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300
                 bg-neutral-50 text-black
                 dark:bg-neutral-950 dark:text-white
                 max-w-2xl mx-auto p-8"
    >
      <div
        className="rounded-3xl shadow-2xl p-8
                   bg-white dark:bg-neutral-900
                   border border-neutral-200
                   dark:border-neutral-700"
      >
        <h1 className="text-3xl font-bold mb-6">
          ⚙️ Gợi ý nâng cao
        </h1>

        <div className="grid grid-cols-2 gap-6">

          {/* Độ khó */}
          <div>
            <label className="font-semibold">Độ khó</label>
            <select
              className="w-full mt-2 p-3 rounded-xl border
                         bg-white dark:bg-neutral-800
                         border-neutral-300
                         dark:border-neutral-600
                         text-black dark:text-white"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Bất kỳ</option>
              <option>Dễ</option>
              <option>Trung bình</option>
              <option>Khó</option>
            </select>
          </div>

          {/* Loại món */}
          <div>
            <label className="font-semibold">Loại món</label>
            <select
              className="w-full mt-2 p-3 rounded-xl border
                         bg-white dark:bg-neutral-800
                         border-neutral-300
                         dark:border-neutral-600
                         text-black dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Bất kỳ</option>
              <option>Món nước</option>
              <option>Món xào</option>
              <option>Ăn vặt</option>
              <option>Healthy</option>
            </select>
          </div>

          {/* Thời gian */}
          <div>
            <label className="font-semibold">
              Thời gian tối đa (phút)
            </label>
            <input
              type="number"
              className="w-full mt-2 p-3 rounded-xl border
                         bg-white dark:bg-neutral-800
                         border-neutral-300
                         dark:border-neutral-600
                         text-black dark:text-white"
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
            />
          </div>

          {/* Calo */}
          <div>
            <label className="font-semibold">
              Calo mục tiêu
            </label>
            <input
              type="number"
              className="w-full mt-2 p-3 rounded-xl border
                         bg-white dark:bg-neutral-800
                         border-neutral-300
                         dark:border-neutral-600
                         text-black dark:text-white"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-8 w-full py-4 rounded-full
                     bg-gradient-to-r from-orange-500 to-pink-500
                     text-white font-semibold shadow-lg
                     hover:scale-105 transition"
        >
          Áp dụng và quay lại AI
        </button>
      </div>
    </div>
  )
}
