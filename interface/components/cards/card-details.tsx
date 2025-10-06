"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, Shield, Gift, Download } from "lucide-react"

export function CardDetails() {
  const cardDetails = {
    id: "1",
    name: "SecureBank Platinum",
    type: "Credit",
    balance: 2450.75,
    creditLimit: 15000.0,
    availableCredit: 12549.25,
    minimumPayment: 75.0,
    paymentDueDate: "2025-02-15",
    interestRate: 18.99,
    rewardsEarned: 2450,
    rewardsValue: 24.5,
  }

  const recentTransactions = [
    {
      date: "2025-01-15",
      merchant: "Amazon.com",
      amount: 89.99,
      category: "Online Shopping",
      status: "Posted",
    },
    {
      date: "2025-01-14",
      merchant: "Starbucks",
      amount: 5.75,
      category: "Food & Dining",
      status: "Posted",
    },
    {
      date: "2025-01-13",
      merchant: "Shell Gas Station",
      amount: 45.2,
      category: "Gas",
      status: "Posted",
    },
    {
      date: "2025-01-12",
      merchant: "Target",
      amount: 127.5,
      category: "Shopping",
      status: "Pending",
    },
  ]

  const creditUtilization = (cardDetails.balance / cardDetails.creditLimit) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Balance:</span>
                    <span className="font-semibold">${cardDetails.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Limit:</span>
                    <span className="font-semibold">${cardDetails.creditLimit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Credit:</span>
                    <span className="font-semibold text-green-600">${cardDetails.availableCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Payment:</span>
                    <span className="font-semibold">${cardDetails.minimumPayment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Due:</span>
                    <span className="font-semibold">{new Date(cardDetails.paymentDueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <span className="font-semibold">{cardDetails.interestRate}% APR</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Credit Utilization</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Used: ${cardDetails.balance.toFixed(2)}</span>
                    <span>{creditUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={creditUtilization} className="h-2" />
                  <p className="text-xs text-muted-foreground">Keep utilization below 30% for better credit score</p>
                </div>

                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Next Payment Due</span>
                  </div>
                  <p className="text-2xl font-bold">${cardDetails.minimumPayment.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Due {new Date(cardDetails.paymentDueDate).toLocaleDateString()}
                  </p>
                  <Button size="sm" className="mt-2">
                    Make Payment
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="space-y-2">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{transaction.merchant}</span>
                      <span className="font-semibold">${transaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                      <span>{transaction.category}</span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        <Badge variant={transaction.status === "Posted" ? "default" : "secondary"} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Rewards Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points Earned:</span>
                    <span className="font-semibold">{cardDetails.rewardsEarned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cash Value:</span>
                    <span className="font-semibold text-green-600">${cardDetails.rewardsValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Redemption Rate:</span>
                    <span className="font-semibold">1 point = $0.01</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Gift className="mr-2 h-4 w-4" />
                  Redeem Rewards
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Earning Categories</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas & Groceries:</span>
                    <span className="font-semibold">3x points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dining:</span>
                    <span className="font-semibold">2x points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Everything Else:</span>
                    <span className="font-semibold">1x points</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security Features</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Fraud Protection</span>
                  </div>
                  <p className="text-sm text-muted-foreground">24/7 monitoring for suspicious activity</p>
                  <Badge variant="default" className="mt-2">
                    Active
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Travel Notifications</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Notify us when traveling abroad</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Set Travel Alert
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
