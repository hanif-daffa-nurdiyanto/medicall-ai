import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@mon/config/db";
import { SessionChatTable } from "@mon/config/schema";
import { eq } from "drizzle-orm";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Depends on AI Doctor agent info and Conversation beween AI medical agents and user, generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:
{
 "sessionId": "string",
 "agent": "string",
 "user": "string",
 "timestamp": "ISO Date string"
 "chiefComplaint": "string",
 "summary": "string",
 "symptoms": ["symptom1", "symptom2"],
 "duration": "string",
 "severity": "string",
 "medicationsMentioned": ["med1", "med2"],
 "recommendations": ["rec1", "rec2"],
}
Only include valid fields. Respond with nothing else.
`;

export async function POST(req: NextRequest) {
  const { messages, sessionId, sessionDetails } = await req.json();

  try {
    const userInput ="AI Doctor agent info: "+ JSON.stringify(sessionDetails)+", Conversation: " + JSON.stringify(messages);
    const prompt = [
      {
        role: "system",
        content: REPORT_GEN_PROMPT
      },
      {
        role: "user",
        content: userInput
      },
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
                .join("\n"),
            },
          ],
        },
      ],
    });

    console.log(response.candidates);

    // Extract text response
    const rawRes = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const res = rawRes.trim().replace("```json", "").replace("```", "");
    const JSONRes = JSON.parse(res);

    console.log("Generated report:", JSONRes);

    //Save to db
    await db
      .update(SessionChatTable)
      .set({
        report: JSONRes,
        conversation: messages ?? null,
      })
      .where(eq(SessionChatTable.sessionId, sessionId)); // If id is integer, convert sessionId to number

    // If SessionChatTable.id is actually a UUID (string), update your schema to use string type for id.
    return NextResponse.json(JSONRes);
  } catch (error) {
    console.error("Error generating report:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
