"use client"
import { motion } from "framer-motion"

export default function FoodCard({ name, img }: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="rounded-2xl overflow-hidden 
                 bg-white/80 backdrop-blur-lg 
                 shadow-lg hover:shadow-2xl 
                 transition-all duration-300"
    >
      <div className="overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={img}
          className="w-full h-60 object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-center">
          {name}
        </h3>

        <button className="mt-4 w-full py-2 rounded-full 
                           bg-gradient-to-r from-orange-500 to-pink-500
                           text-white font-medium
                           hover:opacity-90 transition">
          Xem chi tiết
        </button>
      </div>
    </motion.div>
  )
}
