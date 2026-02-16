import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  })

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  return NextResponse.json({ text })
}
