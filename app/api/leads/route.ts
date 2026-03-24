import { NextResponse } from "next/server";

import { loadActiveLeadsBrazil } from "@/app/lib/open-data";

export async function GET() {
  try {
    const result = await loadActiveLeadsBrazil();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Falha inesperada ao consolidar leads de dados abertos.",
        detail: (error as Error).message
      },
      { status: 500 }
    );
  }
}
