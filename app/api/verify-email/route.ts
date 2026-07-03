import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const loginUrl = new URL("/login", request.url);

  if (!token) {
    loginUrl.searchParams.set("verifyError", "missing_token");
    return NextResponse.redirect(loginUrl);
  }

  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) {
    loginUrl.searchParams.set("verifyError", "invalid_token");
    return NextResponse.redirect(loginUrl);
  }

  if (
    !user.verificationTokenExpiresAt ||
    user.verificationTokenExpiresAt < new Date()
  ) {
    loginUrl.searchParams.set("verifyError", "expired_token");
    return NextResponse.redirect(loginUrl);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpiresAt: null,
    },
  });

  loginUrl.searchParams.set("verified", "1");
  return NextResponse.redirect(loginUrl);
}
