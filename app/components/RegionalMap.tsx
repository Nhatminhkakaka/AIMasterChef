"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { provinces, Province } from "app/lib/provinces"
import SpecialtyCard from "./SpecialtyCard"

interface RegionalMapProps {
  selectedProvinceId?: string | null
  onProvinceClick?: (id: string) => void
}

export default function RegionalMap({ selectedProvinceId, onProvinceClick }: RegionalMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // dynamic transform state for zooming / centering
  const [mapOffsetX, setMapOffsetX] = useState(0)
  const [mapOffsetY, setMapOffsetY] = useState(0)
  const [mapScale, setMapScale] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPan, setLastPan] = useState<{ x: number; y: number } | null>(null)
  const [isFocused, setIsFocused] = useState(false) // pointer over map area

  // prevent page scroll when map is focused
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (isFocused) {
        e.preventDefault()
      }
    }
    window.addEventListener("wheel", handler, { passive: false })
    return () => window.removeEventListener("wheel", handler)
  }, [isFocused])

  // when external selection changes, update internal state and adjust offsets
  useEffect(() => {
    if (selectedProvinceId) {
      const prov = provinces.find((p) => p.id === selectedProvinceId) || null
      setSelectedProvince(prov)
      if (prov) {
        // maintain current scale, just recenter
        const scale = mapScale
        const x = 400 - prov.centerX * scale
        const y = 450 - prov.centerY * scale
        setMapOffsetX(x)
        setMapOffsetY(y)
      }
    } else {
      setSelectedProvince(null)
      setMapScale(1)
      setMapOffsetX(0)
      setMapOffsetY(0)
    }
  }, [selectedProvinceId])

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6">
      {/* ===== MAP AREA ===== */}
      <div className="flex-1 flex overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl shadow-lg relative">
        <div className="relative w-full h-full">
          <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full max-w-full cursor-grab"
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => {
              setIsFocused(false)
              setIsPanning(false)
            }}
            onMouseDown={(e) => {
              setIsPanning(true)
              setLastPan({ x: e.clientX, y: e.clientY })
            }}
            onMouseMove={(e) => {
              if (isPanning && lastPan) {
                const dx = e.clientX - lastPan.x
                const dy = e.clientY - lastPan.y
                setMapOffsetX((o) => o + dx)
                setMapOffsetY((o) => o + dy)
                setLastPan({ x: e.clientX, y: e.clientY })
              }
            }}
            onMouseUp={() => setIsPanning(false)}
            onWheel={(e) => {
              e.preventDefault()
              if (!containerRef.current) return
              const rect = containerRef.current.getBoundingClientRect()
              const factor = e.deltaY < 0 ? 1.1 : 0.9
              const px = (e.clientX - rect.left - mapOffsetX) / mapScale
              const py = (e.clientY - rect.top - mapOffsetY) / mapScale
              const newScale = Math.min(5, Math.max(0.5, mapScale * factor))
              setMapScale(newScale)
              setMapOffsetX(e.clientX - rect.left - px * newScale)
              setMapOffsetY(e.clientY - rect.top - py * newScale)
            }}
          >
          <svg
            ref={svgRef}
            viewBox="0 0 800 900"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full max-w-full"
          >
            {/* Nếu bạn muốn sử dụng hình ảnh làm bản đồ nền, hãy đặt file ảnh vào thư mục public
                 (ví dụ: public/vietnam-map.png) và dùng <image> phía dưới. */}
            <defs>
              <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b3d9ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#80c0ff" stopOpacity={0.5} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* All map layers including provinces are transformed for calibration */}
            <g transform={`translate(${mapOffsetX} ${mapOffsetY}) scale(${mapScale})`}>
              {/* Background image (map) */}
              <image
                href="/vietnam-map.png"
                x="0"
                y="0"
                width="800"
                height="900"
                preserveAspectRatio="xMidYMid meet"
              />
              {/* Fallback gradient in case ảnh không tải được */}
              <rect width="800" height="900" fill="url(#seaGradient)" />

              {/* Tên các vùng */}
              <text x="380" y="80" fontSize="16" fontWeight="bold" fill="#999" textAnchor="middle" className="dark:fill-gray-300">
                Miền Bắc
              </text>
              <text x="400" y="250" fontSize="16" fontWeight="bold" fill="#999" textAnchor="middle" className="dark:fill-gray-300">
                Miền Trung
              </text>
              <text x="550" y="680" fontSize="16" fontWeight="bold" fill="#999" textAnchor="middle" className="dark:fill-gray-300">
                Miền Nam
              </text>

              {/* Vẽ tất cả các tỉnh */}
              {provinces.map((province) => (
                <g key={province.id}>
                  {/* Path tỉnh */}
                  <motion.path
                    d={province.svgPath}
                    fill={
                      hoveredProvince?.id === province.id
                        ? "#ff6b6b"
                        : selectedProvince?.id === province.id
                        ? "#ffd93d"
                        : "#4ecdc4"
                    }
                    stroke="#fff"
                    strokeWidth={hoveredProvince?.id === province.id ? 3 : 1.5}
                    opacity={hoveredProvince?.id === province.id ? 0.9 : 0.6}
                    className="cursor-pointer transition-all hover:opacity-100"
                    whileHover={{ scale: 1.3 }}
                    onMouseEnter={() => setHoveredProvince(province)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={() => {
                      setSelectedProvince(province)
                      onProvinceClick?.(province.id)
                    }}
                    filter={hoveredProvince?.id === province.id ? "url(#glow)" : "none"}
                  />

                  {/* Tên tỉnh - hiển thị khi hover */}
                  <AnimatePresence>
                    {hoveredProvince?.id === province.id && (
                      <motion.text
                        x={province.centerX}
                        y={province.centerY}
                        fontSize="10"
                        fontWeight="bold"
                        fill="#fff"
                        textAnchor="middle"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {province.shortName}
                </motion.text>
                  )}
                </AnimatePresence>
              </g>
            ))}
          </g>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 space-y-2 bg-white/90 dark:bg-neutral-800/90 p-3 rounded-lg backdrop-blur">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4ecdc4" }}></div>
              <span>Bình thường</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ff6b6b" }}></div>
              <span>Di chuột</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ffd93d" }}></div>
              <span>Đã chọn</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== INFO PANEL ===== */}
      <div className="lg:w-96 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {hoveredProvince || selectedProvince ? (
            <motion.div
              key={hoveredProvince?.id || selectedProvince?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-y-auto"
            >
              <SpecialtyCard province={(hoveredProvince || selectedProvince)!} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6 shadow-lg flex items-center justify-center"
            >
              <div className="text-center space-y-3">
                <p className="text-5xl">🗺️</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Hãy di chuột vào bản đồ
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  để khám phá đặc sản của các tỉnh thành
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </div>
  )
}
