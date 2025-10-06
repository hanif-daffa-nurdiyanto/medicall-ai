import { db } from "@mon/config/db";
import { SessionChatTable } from "@mon/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid';
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const  {notes, selectedDoctor} = await req.json();
  const user = await currentUser();
  try{
    const sessionId = uuidv4();
    const result = await db.insert(SessionChatTable).values({
      sessionId,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      notes,
      selectedDoctor,
      createOn: (new Date()).toISOString(),
    }).returning();

    return NextResponse.json(result[0]);
  }catch(e){
    return NextResponse.json(e);
  }
}

export async function GET (req:NextRequest){
  const {searchParams} = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const user = await currentUser();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId in query parameters" }, { status: 400 });
  }
  const result = await db.select().from(SessionChatTable)
    .where(eq(SessionChatTable.sessionId, sessionId));
  return NextResponse.json(result[0] || { error: "Session not found" });
}