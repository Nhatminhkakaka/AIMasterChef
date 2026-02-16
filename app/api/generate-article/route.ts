import { NextResponse } from "next/server"

export async function GET() {
  // 1️⃣ Sinh nội dung bài báo
  const articleRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
          Viết một bài báo chuyên sâu về một món ăn Việt Nam ngẫu nhiên.
          Bao gồm:
          - Tiêu đề
          - Giới thiệu
          - Nguồn gốc
          - Cách làm
          - Thú vị liên quan
          `,
        },
      ],
    }),
  })

  const articleData = await articleRes.json()
  const content = articleData.choices[0].message.content

  // 2️⃣ Sinh ảnh món ăn
  const imageRes = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: "Ảnh món ăn Việt Nam chuyên nghiệp, ánh sáng đẹp, chụp kiểu food photography",
      size: "1024x1024",
    }),
  })

  const imageData = await imageRes.json()
  const imageUrl = imageData.data[0].url

  const id = crypto.randomUUID()

  // 3️⃣ Tạo external URL giả
  const externalUrl = `https://foodnews-ai.com/article/${id}`

  return NextResponse.json({
    id,
    title: content.split("\n")[0],
    imageUrl,
    externalUrl,
  })
}
