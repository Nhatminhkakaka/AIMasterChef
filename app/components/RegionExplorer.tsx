"use client"

import Link from "next/link"
import { provinces, Province } from "app/lib/provinces"

const popular = [
  "ha-noi",
  "da-nang",
  "ho-chi-minh",
  "can-tho",
  "hai-phong",
]

function ProvincePill({ p }: { p: Province }) {
  return (
    <Link href={`/specialty?province=${p.id}`} className="min-w-[220px] flex-shrink-0 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow hover:shadow-2xl transition">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-2xl">{p.specialties[0]?.emoji || '🍽️'}</div>
        <div>
          <div className="font-semibold">{p.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{p.printName}</div>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        {p.specialties.slice(0,2).map((s, i) => (
          <span key={i} className="inline-block mr-2">{s.emoji || '🍽️'} {s.name}</span>
        ))}
      </div>
    </Link>
  )
}

export default function RegionExplorer() {
  const chosen: Province[] = popular.map(id => provinces.find(p => p.id === id)).filter(Boolean) as Province[]

  // collect top specialties across chosen provinces
  const top: { name: string, emoji?: string }[] = []
  chosen.forEach((p) => p.specialties.slice(0,3).forEach(s => top.push({ name: s.name, emoji: s.emoji })))

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h3 className="text-xl font-bold mb-4">Khám phá vùng — Các tỉnh nổi bật</h3>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {chosen.map((p) => (
          <ProvincePill key={p.id} p={p} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {top.slice(0,8).map((t, i) => (
          <div key={i} className="p-3 rounded-lg bg-orange-50 dark:bg-neutral-800 flex items-center gap-3">
            <div className="text-2xl">{t.emoji || '🍽️'}</div>
            <div className="text-sm font-semibold">{t.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/specialty" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full font-semibold shadow">Duyệt tất cả đặc sản</Link>
      </div>
    </section>
  )
}
