"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Article {
  id: string
  title: string
  description: string
  image: string
  externalUrl: string
}

export default function FeaturedCarousel({ items }: { items: Article[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4000)
    return () => clearInterval(t)
  }, [items.length])

  if (!items || items.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {items.map((a) => (
          <div key={a.id} className="min-w-full flex-shrink-0 bg-white dark:bg-neutral-900 shadow-md">
            <div className="relative h-52 md:h-64 w-full">
              <Image src={a.image} alt={a.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-1">{a.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{a.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="absolute inset-y-0 left-3 flex items-center">
        <button onClick={() => setIdx((i) => (i - 1 + items.length) % items.length)} className="bg-white/80 dark:bg-neutral-800/80 p-2 rounded-full shadow">‹</button>
      </div>
      <div className="absolute inset-y-0 right-3 flex items-center">
        <button onClick={() => setIdx((i) => (i + 1) % items.length)} className="bg-white/80 dark:bg-neutral-800/80 p-2 rounded-full shadow">›</button>
      </div>
    </div>
  )
}
