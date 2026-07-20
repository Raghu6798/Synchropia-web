import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const cookies = req.cookies.getAll();
    const users = await prisma.user.findMany();
    const sessions = await prisma.session.findMany();
    const accounts = await prisma.account.findMany();
    return NextResponse.json({ cookies, users, sessions, accounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
