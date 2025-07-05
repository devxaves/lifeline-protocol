import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { trusteeWallet, ownerWallet, vote } = await request.json()
    const { db } = await connectToDatabase()

    // Add vote to the vault
    const result = await db.collection("vaults").updateOne(
      { ownerWallet },
      {
        $push: {
          votes: {
            trusteeWallet,
            vote,
            timestamp: new Date(),
          },
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Vault not found" }, { status: 404 })
    }

    // Check if we have enough votes to make a decision
    const vault = await db.collection("vaults").findOne({ ownerWallet })
    if (vault && vault.votes) {
      const deadVotes = vault.votes.filter((v: any) => v.vote === "dead").length
      const totalTrustees = vault.trustees.length

      // If majority vote dead, start cooldown
      if (deadVotes > totalTrustees / 2) {
        await db.collection("vaults").updateOne(
          { ownerWallet },
          {
            $set: {
              status: "cooldown",
              cooldownStarted: new Date(),
            },
          },
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting vote:", error)
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 })
  }
}
