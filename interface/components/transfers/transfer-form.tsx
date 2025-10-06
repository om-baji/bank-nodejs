"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, DollarSign, Calendar, User, Building } from "lucide-react"

export function TransferForm() {
  const [transferType, setTransferType] = useState("internal")
  const [amount, setAmount] = useState("")
  const [fromAccount, setFromAccount] = useState("")
  const [toAccount, setToAccount] = useState("")

  const accounts = [
    { id: "1", name: "Primary Checking", balance: 15420.5, number: "****1234" },
    { id: "2", name: "High Yield Savings", balance: 25811.39, number: "****5678" },
    { id: "3", name: "Business Account", balance: 4000.0, number: "****9012" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle transfer logic
    console.log("Transfer submitted")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          New Transfer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transfer Type */}
          <div className="space-y-3">
            <Label>Transfer Type</Label>
            <RadioGroup value={transferType} onValueChange={setTransferType} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="internal" />
                <Label htmlFor="internal" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Between My Accounts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="external" id="external" />
                <Label htmlFor="external" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  To Another Person
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wire" id="wire" />
                <Label htmlFor="wire" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Wire Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* From Account */}
          <div className="space-y-2">
            <Label htmlFor="fromAccount">From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {account.name} {account.number}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        ${account.balance.toFixed(2)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Account/Recipient */}
          {transferType === "internal" ? (
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((acc) => acc.id !== fromAccount)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {account.name} {account.number}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            ${account.balance.toFixed(2)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : transferType === "external" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input id="recipientName" placeholder="Enter recipient's full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Email (Optional)</Label>
                <Input id="recipientEmail" type="email" placeholder="recipient@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientAccount">Account Number</Label>
                <Input id="recipientAccount" placeholder="Enter account number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input id="routingNumber" placeholder="Enter routing number" />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="wireBankName">Bank Name</Label>
                <Input id="wireBankName" placeholder="Enter bank name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wireSwiftCode">SWIFT Code</Label>
                <Input id="wireSwiftCode" placeholder="Enter SWIFT code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wireBeneficiary">Beneficiary Name</Label>
                <Input id="wireBeneficiary" placeholder="Enter beneficiary name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wireBeneficiaryAccount">Beneficiary Account</Label>
                <Input id="wireBeneficiaryAccount" placeholder="Enter account number" />
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="pl-10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {transferType === "wire" && <p className="text-sm text-muted-foreground">Wire transfer fee: $25.00</p>}
          </div>

          {/* Transfer Date */}
          <div className="space-y-2">
            <Label htmlFor="transferDate">Transfer Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="transferDate" type="date" className="pl-10" min={new Date().toISOString().split("T")[0]} />
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Textarea id="memo" placeholder="Add a note for this transfer..." className="resize-none" rows={3} />
          </div>

          {/* Transfer Summary */}
          {amount && fromAccount && (transferType === "internal" ? toAccount : true) && (
            <div className="p-4 bg-accent/10 rounded-lg space-y-2">
              <h3 className="font-semibold">Transfer Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Transfer Amount:</span>
                  <span className="font-medium">${Number.parseFloat(amount || "0").toFixed(2)}</span>
                </div>
                {transferType === "wire" && (
                  <div className="flex justify-between">
                    <span>Wire Fee:</span>
                    <span className="font-medium">$25.00</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total:</span>
                  <span>${(Number.parseFloat(amount || "0") + (transferType === "wire" ? 25 : 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 bg-transparent">
              Save as Draft
            </Button>
            <Button type="submit" className="flex-1">
              {transferType === "internal" ? "Transfer Now" : "Review Transfer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
