"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, MoreHorizontal, Download, Send, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AccountsList() {
  const [showBalances, setShowBalances] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState("1")

  const accounts = [
    {
      id: "1",
      name: "Primary Checking",
      type: "Checking",
      accountNumber: "1234567890",
      routingNumber: "021000021",
      balance: 15420.5,
      availableBalance: 15420.5,
      status: "Active",
      interestRate: 0.01,
      minimumBalance: 100.0,
      openDate: "2020-03-15",
    },
    {
      id: "2",
      name: "High Yield Savings",
      type: "Savings",
      accountNumber: "0987654321",
      routingNumber: "021000021",
      balance: 25811.39,
      availableBalance: 25811.39,
      status: "Active",
      interestRate: 4.25,
      minimumBalance: 500.0,
      openDate: "2021-06-10",
    },
    {
      id: "3",
      name: "Business Checking",
      type: "Business",
      accountNumber: "5555666677",
      routingNumber: "021000021",
      balance: 4000.0,
      availableBalance: 3750.0,
      status: "Active",
      interestRate: 0.05,
      minimumBalance: 1000.0,
      openDate: "2022-01-20",
    },
    {
      id: "4",
      name: "Certificate of Deposit",
      type: "CD",
      accountNumber: "1111222233",
      routingNumber: "021000021",
      balance: 10000.0,
      availableBalance: 0.0,
      status: "Locked",
      interestRate: 5.5,
      minimumBalance: 10000.0,
      openDate: "2024-01-01",
      maturityDate: "2025-01-01",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Accounts</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalances ? "Hide" : "Show"} Balances
          </Button>
          <Button size="sm">Open New Account</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedAccount === account.id ? "border-primary bg-primary/5" : "hover:bg-accent/50"
              }`}
              onClick={() => setSelectedAccount(account.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{account.name}</h3>
                    <Badge variant={account.status === "Active" ? "default" : "secondary"}>{account.status}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {account.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Account Number</p>
                      <p className="font-mono">****{account.accountNumber.slice(-4)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available Balance</p>
                      <p className="font-semibold">
                        {showBalances ? `$${account.availableBalance.toFixed(2)}` : "••••••"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-xl font-bold">{showBalances ? `$${account.balance.toFixed(2)}` : "••••••"}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Transfer Money
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download Statement
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
