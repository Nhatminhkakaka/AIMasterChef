"use client"

import Image from "next/image"
import { generateArticles } from "./lib/articles"

export default function HomePage() {
  const articles = generateArticles()

  return (
    <div
      className="min-h-screen transition-colors duration-300
                 bg-neutral-50 text-black
                 dark:bg-neutral-950 dark:text-white"
    >
      
      {/* Hero Title */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Food Magazine
        </h1>

        <p className="mt-4 text-lg
                      text-gray-600
                      dark:text-gray-400">
          Khám phá tinh hoa ẩm thực Việt Nam
        </p>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((article) => (
          <div
            key={article.id}
            className="group relative rounded-3xl overflow-hidden shadow-xl
                       hover:shadow-2xl transition-all duration-500"
          >
            {/* Image */}
            <div className="relative h-[420px] w-full overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 
                           group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t 
                           from-black/70 via-black/30 to-transparent 
                           opacity-90"
              ></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 p-6 text-white">
              <h2 className="text-2xl font-bold leading-tight mb-3">
                {article.title}
              </h2>

              <p className="text-sm text-gray-200 mb-4 line-clamp-3">
                {article.description}
              </p>

              <a
                href={article.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 hover:bg-orange-600
                           transition px-5 py-2 rounded-full text-sm font-semibold"
              >
                Xem chi tiết
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
