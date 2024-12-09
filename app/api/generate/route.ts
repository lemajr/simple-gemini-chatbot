import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Generate the content stream
    const result = await model.generateContentStream(prompt);

    // Concatenate chunks of text as they come in
    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      fullText += chunkText;
    }

    // Ensure trimming and no extra white space
    fullText = fullText.trim();

    // Return the full generated text as a response
    return NextResponse.json({ text: fullText });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Error generating content. Please try again later." },
      { status: 500 }
    );
  }
}
