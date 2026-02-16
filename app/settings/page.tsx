"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/app/lib/supabase"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function SettingsPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [theme, setTheme] = useState("light")

  // ===============================
  // LOAD PROFILE + THEME
  // ===============================
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setFullName(data.full_name || "")
        setAvatarUrl(data.avatar_url || "")
      }
    }

    loadProfile()

    const savedTheme =
      localStorage.getItem("theme") || "light"

    setTheme(savedTheme)

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [router])

  // ===============================
  // SAVE PROFILE
  // ===============================
  const handleSaveProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id)

    setOpenSection(null)
  }

  // ===============================
  // TOGGLE THEME
  // ===============================
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"

    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        ⚙️ Cài đặt
      </h1>

      <div className="space-y-4">

        {/* ================= NAME ================= */}
        <div className="rounded-2xl border dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <button
            onClick={() => toggleSection("name")}
            className="w-full text-left px-6 py-4 font-semibold"
          >
            👤 Tên hiển thị
          </button>

          <AnimatePresence>
            {openSection === "name" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6"
              >
                <input
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  className="w-full p-3 mb-4 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                />

                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
                >
                  Lưu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= AVATAR ================= */}
        <div className="rounded-2xl border dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <button
            onClick={() => toggleSection("avatar")}
            className="w-full text-left px-6 py-4 font-semibold"
          >
            🖼 Avatar
          </button>

          <AnimatePresence>
            {openSection === "avatar" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6"
              >
                <input
                  value={avatarUrl}
                  onChange={(e) =>
                    setAvatarUrl(e.target.value)
                  }
                  placeholder="Link avatar"
                  className="w-full p-3 mb-4 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                />

                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
                >
                  Lưu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= THEME ================= */}
        <div className="rounded-2xl border dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <button
            onClick={() => toggleSection("theme")}
            className="w-full text-left px-6 py-4 font-semibold"
          >
            🌗 Giao diện
          </button>

          <AnimatePresence>
            {openSection === "theme" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6 flex items-center justify-between"
              >
                <span>
                  {theme === "dark"
                    ? "Chế độ tối"
                    : "Chế độ sáng"}
                </span>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                    className="sr-only peer"
                  />

                  <div
                    className="w-12 h-6 bg-gray-300 rounded-full 
                              peer dark:bg-neutral-700
                              peer-checked:bg-black
                              transition-colors"
                  ></div>

                  <div
                    className="absolute left-1 top-1 w-4 h-4 
                              bg-white rounded-full
                              transition-all
                              peer-checked:translate-x-6"
                  ></div>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
