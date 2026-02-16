"use client"

import { useEffect, useState } from "react"
import { supabase } from "app/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile({
        email: user.email,
        ...data,
      })
    }

    getProfile()
  }, [])

  if (!profile) return <div className="p-10">Loading...</div>

  return (
    <div className="min-h-screen p-10 bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white">
      <div className="max-w-md mx-auto bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-xl">

        <div className="flex flex-col items-center">
          <img
            src={profile.avatar_url || "/avatar.png"}
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
          <h2 className="text-xl font-bold">
            {profile.full_name || "Chưa đặt tên"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {profile.email}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="text-sm">Mật khẩu</label>
            <input
              type="password"
              value="********"
              disabled
              className="w-full p-2 border rounded-lg bg-neutral-100 dark:bg-neutral-800"
            />
          </div>

          <button
            onClick={() => router.push("/settings")}
            className="w-full bg-black dark:bg-white dark:text-black text-white py-2 rounded-full mt-4"
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>
    </div>
  )
}
