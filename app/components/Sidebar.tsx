"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { supabase } from "app/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <motion.aside
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed top-16 left-0
        h-[calc(100vh-4rem)]
        z-40
        ${open ? "w-64" : "w-20"}
        transition-all duration-300
        bg-white dark:bg-neutral-900
        text-black dark:text-white
        border-r border-neutral-200 dark:border-neutral-800
        shadow-xl
        flex flex-col justify-between
      `}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* MENU */}
      <div className="p-4 mt-6 space-y-2">
        <NavItem href="/" icon="🏠" label="Trang chủ" open={open} />
        <NavItem href="/ai" icon="🤖" label="AI" open={open} />
        <NavItem href="/history" icon="📜" label="Lịch sử" open={open} />
        <NavItem href="/suggest" icon="⭐" label="Gợi ý" open={open} />
        <NavItem href="/settings" icon="⚙️" label="Cài đặt" open={open} />
      </div>

      {/* USER SECTION */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        {user ? (
          <>
            {open && (
              <p className="text-sm mb-3 truncate opacity-60">
                {user.email}
              </p>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3
                         rounded-xl
                         bg-red-500 text-white
                         hover:bg-red-600
                         transition"
            >
              <span className="text-xl">🚪</span>
              {open && <span className="font-medium">Đăng xuất</span>}
            </button>
          </>
        ) : (
          <NavItem href="/login" icon="🔐" label="Đăng nhập" open={open} />
        )}
      </div>
    </motion.aside>
  )
}

function NavItem({
  href,
  icon,
  label,
  open,
}: {
  href: string
  icon: string
  label: string
  open: boolean
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <div
        className={`
          relative flex items-center gap-4 px-4 py-3
          rounded-xl
          transition-all duration-200
          group cursor-pointer

          ${
            isActive
              ? "bg-neutral-200 dark:bg-neutral-800"
              : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
          }
        `}
      >
        {/* Active Indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-r-full" />
        )}

        {/* Icon */}
        <span
          className={`
            text-xl transition-transform duration-200
            group-hover:scale-110
            ${isActive ? "text-yellow-500" : ""}
          `}
        >
          {icon}
        </span>

        {/* Label */}
        {open && (
          <span
            className={`font-medium ${
              isActive ? "text-yellow-500" : ""
            }`}
          >
            {label}
          </span>
        )}
      </div>
    </Link>
  )
}
