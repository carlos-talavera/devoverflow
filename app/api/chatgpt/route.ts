import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  const { question } = await request.json()

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a knowledgeable programming assistant that provides quality information in the most brief, but comprehensive way.",
            },
            {
              role: "user",
              content: `Tell me ${question}`,
            },
          ],
          max_tokens: 256
        })
      }
    )

    const { choices } = await response.json()

    return NextResponse.json({ reply: choices[0].message.content })
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
}