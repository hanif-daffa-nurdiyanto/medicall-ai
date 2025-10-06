import { openai } from "@mon/config/OpenAIModel";
import { AIDoctorAgents } from "@mon/shared/list";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const prompt = [
      {
        role: "system",
        content: JSON.stringify(AIDoctorAgents)
      },
      {
        role: "user",
        content:
          "User Notes/Symptoms: " +
          notes +
          ", Depends on user notes and symptoms, Please suggest list of doctors, always suggest General Practitioner, Return Object in JSON only with format [{id:number,...},{id:number,...}], if the symptoms are not clear, return []"
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
                .map((msg) => `[${msg.role}]: ${msg.content}`)
                .join("\n")
            }
          ]
        }
      ]
    });

    console.log(response.candidates);

    // Extract text response
    const rawRes = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const res = rawRes.trim().replace("```json", "").replace("```", "");
    const JSONRes = JSON.parse(res);

    return NextResponse.json(JSONRes);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : e });
  }
}