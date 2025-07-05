"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Wallet, Edit, Vote, Eye } from "lucide-react"
import Link from "next/link"

interface VaultData {
  _id: string
  ownerWallet: string
  nomineeWallet: string
  trustees: string[]
  status: "active" | "pending_vote" | "cooldown" | "transferred"
  lastHeartbeat: string
  heartbeatInterval: number
  cooldownPeriod: number
  assetType: string
  amount: number
  userRole: "owner" | "trustee" | "nominee"
  pendingVotes?: any[]
  cooldownStarted?: string
}

export default function Dashboard() {
  const [vaultData, setVaultData] = useState<VaultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [heartbeatCountdown, setHeartbeatCountdown] = useState(0)

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        const walletAddress = localStorage.getItem("walletAddress")
        if (!walletAddress) {
          window.location.href = "/"
          return
        }

        const response = await fetch(`/api/vault/${walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setVaultData(data)

          // Calculate countdown
          if (data.userRole === "owner" && data.lastHeartbeat) {
            const lastHeartbeat = new Date(data.lastHeartbeat)
            const nextHeartbeat = new Date(lastHeartbeat.getTime() + data.heartbeatInterval * 24 * 60 * 60 * 1000)
            const now = new Date()
            const timeLeft = Math.max(0, nextHeartbeat.getTime() - now.getTime())
            setHeartbeatCountdown(Math.floor(timeLeft / (1000 * 60 * 60 * 24)))
          }
        }
      } catch (error) {
        console.error("Error fetching vault data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVaultData()
  }, [])

  const handleHeartbeat = async () => {
    try {
      const walletAddress = localStorage.getItem("walletAddress")
      const response = await fetch("/api/vault/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error sending heartbeat:", error)
    }
  }

  const handleVote = async (vote: string) => {
    try {
      const walletAddress = localStorage.getItem("walletAddress")
      const response = await fetch("/api/trustee/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trusteeWallet: walletAddress,
          ownerWallet: vaultData?.ownerWallet,
          vote,
        }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting vote:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!vaultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Vault Found</CardTitle>
            <CardDescription>You don't have a vault set up yet or aren't associated with any vaults.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/register">
              <Button className="w-full">Create New Vault</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending_vote":
        return "bg-yellow-500"
      case "cooldown":
        return "bg-orange-500"
      case "transferred":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            LifeLine Dashboard - {vaultData.userRole.charAt(0).toUpperCase() + vaultData.userRole.slice(1)}
          </h1>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>

        {/* Owner Dashboard */}
        {vaultData.userRole === "owner" && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Vault Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Badge className={getStatusColor(vaultData.status)}>
                      {vaultData.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Last Heartbeat: {new Date(vaultData.lastHeartbeat).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Days until next heartbeat:</p>
                    <p className="text-2xl font-bold text-blue-600">{heartbeatCountdown}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Heartbeat Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Heartbeat Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleHeartbeat} className="bg-green-600 hover:bg-green-700">
                  <Heart className="mr-2 h-4 w-4" />I Am Alive
                </Button>
              </CardContent>
            </Card>

            {/* Vault Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Vault Details
                  <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Nominee:</p>
                  <p className="text-sm text-gray-600 font-mono">{vaultData.nomineeWallet}</p>
                </div>
                <div>
                  <p className="font-medium">Trustees ({vaultData.trustees.length}):</p>
                  {vaultData.trustees.map((trustee, index) => (
                    <p key={index} className="text-sm text-gray-600 font-mono">
                      {trustee}
                    </p>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Asset Type:</p>
                    <p className="text-sm text-gray-600">{vaultData.assetType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Amount:</p>
                    <p className="text-sm text-gray-600">{vaultData.amount}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Withdraw Funds (Mock)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trustee Dashboard */}
        {vaultData.userRole === "trustee" && (
          <div className="space-y-6">
            {vaultData.status === "pending_vote" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Vote Required
                  </CardTitle>
                  <CardDescription>The owner hasn't sent a heartbeat. Please vote on their status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Owner Address:</p>
                    <p className="text-sm text-gray-600 font-mono">{vaultData.ownerWallet}</p>
                  </div>
                  <div>
                    <p className="font-medium">Time since last heartbeat:</p>
                    <p className="text-sm text-gray-600">
                      {Math.floor((Date.now() - new Date(vaultData.lastHeartbeat).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                      days
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => handleVote("alive")} className="bg-green-600 hover:bg-green-700">
                      ✅ Alive
                    </Button>
                    <Button onClick={() => handleVote("unavailable")} className="bg-yellow-600 hover:bg-yellow-700">
                      🟡 Unavailable
                    </Button>
                    <Button onClick={() => handleVote("dead")} className="bg-red-600 hover:bg-red-700">
                      ❌ Dead
                    </Button>
                    <Button onClick={() => handleVote("unknown")} variant="outline">
                      ❓ Don't Know
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Votes Pending</CardTitle>
                  <CardDescription>All vaults you're a trustee for are currently active.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

        {/* Nominee Dashboard */}
        {vaultData.userRole === "nominee" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Inheritance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Owner Wallet:</p>
                  <p className="text-sm text-gray-600 font-mono">{vaultData.ownerWallet}</p>
                </div>
                <div>
                  <p className="font-medium">Vault Status:</p>
                  <Badge className={getStatusColor(vaultData.status)}>
                    {vaultData.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                {vaultData.status === "cooldown" && (
                  <div>
                    <p className="font-medium">Cooldown Period:</p>
                    <p className="text-sm text-gray-600">{vaultData.cooldownPeriod} days remaining</p>
                    <Progress value={50} className="mt-2" />
                  </div>
                )}
                <div>
                  <p className="font-medium">Funds Awaiting Release:</p>
                  <p className="text-lg font-bold text-green-600">
                    {vaultData.amount} {vaultData.assetType}
                  </p>
                </div>
                {vaultData.status === "transferred" && (
                  <Button className="w-full bg-green-600 hover:bg-green-700">Claim Inheritance (Mock)</Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
