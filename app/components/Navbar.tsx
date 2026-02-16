"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "app/lib/supabase"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
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
    <nav className="fixed top-0 left-0 right-0 z-50
                h-16
                flex justify-between items-center
                px-6
                bg-white dark:bg-neutral-900
                border-b border-neutral-200 dark:border-neutral-700">
      <Link href="/" className="font-bold text-lg">
        AIMasterChef
      </Link>

      {loading ? null : user ? (
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="hover:underline"
          >
            Hồ sơ
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full
                       bg-black text-white
                       dark:bg-white dark:text-black"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 rounded-full
                     bg-black text-white
                     dark:bg-white dark:text-black"
        >
          Đăng nhập
        </Link>
      )}
    </nav>
  )
}
