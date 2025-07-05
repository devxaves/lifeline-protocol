import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ownerWallet, nomineeWallet, trustees, heartbeatInterval, cooldownPeriod, assetType, amount } = body

    const { db } = await connectToDatabase()

    const vault = {
      ownerWallet,
      nomineeWallet,
      trustees: trustees.filter((t: string) => t.trim() !== ""),
      heartbeatInterval: Number.parseInt(heartbeatInterval),
      cooldownPeriod: Number.parseInt(cooldownPeriod),
      assetType,
      amount: Number.parseFloat(amount),
      status: "active",
      lastHeartbeat: new Date(),
      createdAt: new Date(),
      votes: [],
    }

    const result = await db.collection("vaults").insertOne(vault)

    return NextResponse.json({ success: true, vaultId: result.insertedId })
  } catch (error) {
    console.error("Error creating vault:", error)
    return NextResponse.json({ error: "Failed to create vault" }, { status: 500 })
  }
}
