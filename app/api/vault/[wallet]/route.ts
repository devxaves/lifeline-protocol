import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { wallet: string } }) {
  try {
    const walletAddress = params.wallet
    const { db } = await connectToDatabase()

    // Check if user is owner
    let vault = await db.collection("vaults").findOne({ ownerWallet: walletAddress })
    if (vault) {
      return NextResponse.json({ ...vault, userRole: "owner" })
    }

    // Check if user is trustee
    vault = await db.collection("vaults").findOne({ trustees: walletAddress })
    if (vault) {
      return NextResponse.json({ ...vault, userRole: "trustee" })
    }

    // Check if user is nominee
    vault = await db.collection("vaults").findOne({ nomineeWallet: walletAddress })
    if (vault) {
      return NextResponse.json({ ...vault, userRole: "nominee" })
    }

    return NextResponse.json({ error: "No vault found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching vault:", error)
    return NextResponse.json({ error: "Failed to fetch vault" }, { status: 500 })
  }
}
