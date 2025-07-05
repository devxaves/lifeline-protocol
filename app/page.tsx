"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Shield, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)
    // Mock wallet connection
    setTimeout(() => {
      localStorage.setItem("walletAddress", "0x1234567890abcdef1234567890abcdef12345678")
      setIsConnecting(false)
      window.location.href = "/dashboard"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">LifeLine Protocol</h1>
          </div>
          <Button onClick={connectWallet} disabled={isConnecting} className="bg-blue-600 hover:bg-blue-700">
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Secure Your Digital Legacy</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ensure your crypto assets are safely inherited by your loved ones with our decentralized inheritance
            protocol. Set up trustees, nominees, and automated heartbeat monitoring.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Trustee Network</CardTitle>
              <CardDescription>Add up to 5 trusted individuals who can vote on your status</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Heartbeat Monitoring</CardTitle>
              <CardDescription>Regular check-ins to prove you're alive and well</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Secure Transfer</CardTitle>
              <CardDescription>Automated asset transfer to your chosen nominee</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              New User - Set Up Vault
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
              Existing User - Access Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
