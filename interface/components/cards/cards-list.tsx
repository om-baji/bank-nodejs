"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, MoreHorizontal, Lock, Unlock, CreditCard, Smartphone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CardsList() {
  const [showCardNumbers, setShowCardNumbers] = useState(false)
  const [selectedCard, setSelectedCard] = useState("1")

  const cards = [
    {
      id: "1",
      name: "SecureBank Platinum",
      type: "Credit",
      cardNumber: "4532123456789012",
      expiryDate: "12/27",
      cvv: "123",
      status: "Active",
      isLocked: false,
      balance: 2450.75,
      creditLimit: 15000.0,
      availableCredit: 12549.25,
      cardColor: "bg-gradient-to-br from-slate-800 to-slate-900",
      textColor: "text-white",
      rewards: "Cash Back",
      lastUsed: "2025-01-15",
    },
    {
      id: "2",
      name: "SecureBank Debit",
      type: "Debit",
      cardNumber: "5432109876543210",
      expiryDate: "08/26",
      cvv: "456",
      status: "Active",
      isLocked: false,
      balance: 15420.5,
      cardColor: "bg-gradient-to-br from-blue-600 to-blue-800",
      textColor: "text-white",
      lastUsed: "2025-01-14",
    },
    {
      id: "3",
      name: "SecureBank Business",
      type: "Credit",
      cardNumber: "4111111111111111",
      expiryDate: "03/28",
      cvv: "789",
      status: "Active",
      isLocked: true,
      balance: 850.0,
      creditLimit: 25000.0,
      availableCredit: 24150.0,
      cardColor: "bg-gradient-to-br from-purple-600 to-purple-800",
      textColor: "text-white",
      rewards: "Business Points",
      lastUsed: "2025-01-10",
    },
  ]

  const toggleCardLock = (cardId: string) => {
    // Handle card lock/unlock logic
    console.log(`Toggle lock for card ${cardId}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Cards</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCardNumbers(!showCardNumbers)}>
            {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showCardNumbers ? "Hide" : "Show"} Numbers
          </Button>
          <Button size="sm">Request New Card</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {cards.map((card) => (
            <div key={card.id} className="space-y-4">
              {/* Card Visual */}
              <div
                className={`relative p-6 rounded-xl ${card.cardColor} ${card.textColor} cursor-pointer transition-transform hover:scale-105`}
                onClick={() => setSelectedCard(card.id)}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm opacity-80">SecureBank</p>
                    <p className="text-lg font-semibold">{card.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={card.type === "Credit" ? "default" : "secondary"} className="text-xs">
                      {card.type}
                    </Badge>
                    {card.isLocked && <Lock className="h-4 w-4" />}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-mono text-xl tracking-wider">
                    {showCardNumbers
                      ? card.cardNumber.replace(/(.{4})/g, "$1 ").trim()
                      : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-60">VALID THRU</p>
                      <p className="font-mono">{showCardNumbers ? card.expiryDate : "••/••"}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-60">CVV</p>
                      <p className="font-mono">{showCardNumbers ? card.cvv : "•••"}</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-white/20 rounded"></div>
                      <div className="w-8 h-5 bg-white/40 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={card.status === "Active" ? "default" : "secondary"}>{card.status}</Badge>
                    {card.isLocked && (
                      <Badge variant="destructive" className="text-xs">
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {card.type === "Credit" ? "Current Balance" : "Account Balance"}
                  </p>
                  <p className="font-semibold">${card.balance.toFixed(2)}</p>
                </div>

                {card.type === "Credit" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Available Credit</p>
                      <p className="font-semibold text-green-600">${card.availableCredit?.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Credit Limit</p>
                      <p className="font-semibold">${card.creditLimit?.toFixed(2)}</p>
                    </div>
                  </>
                )}

                {card.type === "Debit" && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Used</p>
                    <p className="font-semibold">{new Date(card.lastUsed).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Card Controls */}
              <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={!card.isLocked} onCheckedChange={() => toggleCardLock(card.id)} />
                    <span className="text-sm font-medium">{card.isLocked ? "Card Locked" : "Card Active"}</span>
                  </div>

                  {card.rewards && (
                    <Badge variant="outline" className="text-xs">
                      {card.rewards}
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      View Transactions
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Add to Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {card.isLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                      {card.isLocked ? "Unlock Card" : "Lock Card"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
