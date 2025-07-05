"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nomineeWallet: "",
    trustees: [""],
    heartbeatInterval: "",
    cooldownPeriod: "",
    assetType: "",
    amount: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTrustee = () => {
    if (formData.trustees.length < 5) {
      setFormData((prev) => ({
        ...prev,
        trustees: [...prev.trustees, ""],
      }))
    }
  }

  const removeTrustee = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      trustees: prev.trustees.filter((_, i) => i !== index),
    }))
  }

  const updateTrustee = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      trustees: prev.trustees.map((trustee, i) => (i === index ? value : trustee)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const walletAddress = localStorage.getItem("walletAddress")
      const response = await fetch("/api/vault/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerWallet: walletAddress,
          ...formData,
          trustees: formData.trustees.filter((t) => t.trim() !== ""),
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        alert("Failed to create vault")
      }
    } catch (error) {
      alert("Error creating vault")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your LifeLine Vault</CardTitle>
            <CardDescription>
              Set up your digital inheritance protocol with trusted nominees and trustees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nominee Wallet */}
              <div className="space-y-2">
                <Label htmlFor="nominee">Nominee Wallet Address</Label>
                <Input
                  id="nominee"
                  placeholder="0x..."
                  value={formData.nomineeWallet}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nomineeWallet: e.target.value }))}
                  required
                />
              </div>

              {/* Trustees */}
              <div className="space-y-2">
                <Label>Trustee Wallet Addresses (up to 5)</Label>
                {formData.trustees.map((trustee, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Trustee ${index + 1} wallet address`}
                      value={trustee}
                      onChange={(e) => updateTrustee(index, e.target.value)}
                    />
                    {formData.trustees.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeTrustee(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.trustees.length < 5 && (
                  <Button type="button" variant="outline" onClick={addTrustee}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Trustee
                  </Button>
                )}
              </div>

              {/* Heartbeat Interval */}
              <div className="space-y-2">
                <Label htmlFor="heartbeat">Heartbeat Interval (days)</Label>
                <Input
                  id="heartbeat"
                  type="number"
                  min="1"
                  max="365"
                  placeholder="30"
                  value={formData.heartbeatInterval}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heartbeatInterval: e.target.value }))}
                  required
                />
              </div>

              {/* Cooldown Period */}
              <div className="space-y-2">
                <Label htmlFor="cooldown">Cooldown Period</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, cooldownPeriod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cooldown period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Type */}
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, assetType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APT">APT</SelectItem>
                    <SelectItem value="NFT">NFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Deposit</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Vault..." : "Create Vault"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
