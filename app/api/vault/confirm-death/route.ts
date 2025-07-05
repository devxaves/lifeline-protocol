import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { ownerWallet } = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("vaults").updateOne(
      { ownerWallet },
      {
        $set: {
          status: "transferred",
          transferredAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Vault not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error confirming death:", error)
    return NextResponse.json({ error: "Failed to confirm death" }, { status: 500 })
  }
}
