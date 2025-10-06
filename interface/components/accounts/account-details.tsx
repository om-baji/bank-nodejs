"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, TrendingUp, AlertCircle, Download } from "lucide-react"

export function AccountDetails() {
  const accountDetails = {
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
    lastStatement: "2025-01-01",
    nextStatement: "2025-02-01",
  }

  const recentActivity = [
    {
      date: "2025-01-15",
      description: "Direct Deposit - Salary",
      amount: 3500.0,
      type: "credit",
      balance: 15420.5,
    },
    {
      date: "2025-01-14",
      description: "Amazon Purchase",
      amount: -89.99,
      type: "debit",
      balance: 11920.5,
    },
    {
      date: "2025-01-14",
      description: "Electric Bill Payment",
      amount: -125.5,
      type: "debit",
      balance: 12010.49,
    },
    {
      date: "2025-01-13",
      description: "ATM Withdrawal",
      amount: -100.0,
      type: "debit",
      balance: 12135.99,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">{accountDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Type:</span>
                    <Badge variant="outline">{accountDetails.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-mono">****{accountDetails.accountNumber.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Routing Number:</span>
                    <span className="font-mono">{accountDetails.routingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">{accountDetails.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opened:</span>
                    <span>{new Date(accountDetails.openDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Balance Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Balance:</span>
                    <span className="text-xl font-bold">${accountDetails.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Balance:</span>
                    <span className="font-semibold text-green-600">${accountDetails.availableBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Balance:</span>
                    <span>${accountDetails.minimumBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      {accountDetails.interestRate}% APY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="space-y-2">
              {recentActivity.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{transaction.description}</span>
                      <span
                        className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "credit" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      <span>Balance: ${transaction.balance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Account Statements</h3>
              <Button size="sm">Request Statement</Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">January 2025 Statement</p>
                    <p className="text-sm text-muted-foreground">Generated on Jan 1, 2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">December 2024 Statement</p>
                    <p className="text-sm text-muted-foreground">Generated on Dec 1, 2024</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Account Alerts</h3>
              <Button size="sm">Manage Alerts</Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium">Low Balance Alert</p>
                  <p className="text-sm text-muted-foreground">You'll be notified when your balance falls below $500</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Large Transaction Alert</p>
                  <p className="text-sm text-muted-foreground">Get notified for transactions over $1,000</p>
                </div>
                <Badge variant="secondary">Inactive</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
