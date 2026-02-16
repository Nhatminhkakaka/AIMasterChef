"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setDark(!dark)
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm">Chế độ tối</span>

      <button
        onClick={toggleTheme}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300
        ${dark ? "bg-orange-500" : "bg-gray-300"}`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300
          ${dark ? "translate-x-6" : ""}`}
        />
      </button>
    </div>
  )
}
