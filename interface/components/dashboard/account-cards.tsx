"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export function AccountCards() {
  const [showBalance, setShowBalance] = useState(true)

  const accounts = [
    {
      id: "1",
      name: "Primary Checking",
      type: "Checking",
      balance: 15420.5,
      accountNumber: "****1234",
      status: "active",
    },
    {
      id: "2",
      name: "High Yield Savings",
      type: "Savings",
      balance: 25811.39,
      accountNumber: "****5678",
      status: "active",
    },
    {
      id: "3",
      name: "Business Account",
      type: "Business",
      balance: 4000.0,
      accountNumber: "****9012",
      status: "active",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Accounts</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowBalance(!showBalance)}>
          {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div key={account.id} className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <Badge variant="outline" className="text-xs">
                    {account.type}
                  </Badge>
                </div>
                <Badge variant="default" className="text-xs">
                  {account.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">{account.name}</h3>
                <p className="text-sm text-muted-foreground">Account {account.accountNumber}</p>
                <div className="text-2xl font-bold">{showBalance ? `$${account.balance.toFixed(2)}` : "••••••"}</div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Transfer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
