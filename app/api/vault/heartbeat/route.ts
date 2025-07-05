import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("vaults").updateOne(
      { ownerWallet: walletAddress },
      {
        $set: {
          lastHeartbeat: new Date(),
          status: "active",
        },
        $unset: { votes: "" },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Vault not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating heartbeat:", error)
    return NextResponse.json({ error: "Failed to update heartbeat" }, { status: 500 })
  }
}
