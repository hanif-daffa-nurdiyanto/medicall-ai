import { currentUser } from "@clerk/nextjs/server";
import { db } from "@mon/config/db";
import { NextRequest, NextResponse } from "next/server";
import { usersTable } from "@mon/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  try {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: "User email is undefined." },
        { status: 400 }
      );
    }
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (users?.length == 0) {
      const result = await db.insert(usersTable).values({
        name: user?.fullName ?? "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        credits: 10
      }).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, credits: usersTable.credits })

      return NextResponse.json(result[0]);
    }

    return NextResponse.json(users[0]);
  } catch (e) {
    console.log('users 4')
    return NextResponse.json(
      {
        error: (e instanceof Error) ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}