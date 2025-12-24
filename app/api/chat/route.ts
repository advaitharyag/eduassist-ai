import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

    // Build context-aware prompt
    const systemPrompt = context
      ? `You are an educational AI assistant. Context: ${JSON.stringify(context)}. Provide helpful, clear explanations suitable for students.`
      : "You are an educational AI assistant. Provide helpful, clear explanations suitable for students."

    const fullPrompt = `${systemPrompt}\n\nStudent question: ${message}`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
