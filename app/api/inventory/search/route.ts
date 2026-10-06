import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getInventorySearchSuggestions } from "@/lib/inventory";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  const search = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!search) {
    return NextResponse.json([]);
  }

  if (search.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const suggestions = await getInventorySearchSuggestions(search);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Failed to fetch inventory search suggestions:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch search suggestions.",
      },
      {
        status: 500,
      },
    );
  }
}
