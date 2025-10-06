"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, CheckCircle, Clock, Eye, Flag } from "lucide-react"

export function TransactionMonitoring() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  const transactions = [
    {
      id: "TXN001234567",
      customer: "John Smith",
      type: "Wire Transfer",
      amount: 15000.0,
      fromAccount: "****1234",
      toAccount: "External Bank",
      status: "flagged",
      riskLevel: "high",
      timestamp: "2025-01-15 14:30:00",
      flags: ["Large Amount", "Unusual Pattern"],
      description: "International wire transfer",
    },
    {
      id: "TXN001234568",
      customer: "Sarah Johnson",
      type: "ACH Transfer",
      amount: 2500.0,
      fromAccount: "****5678",
      toAccount: "****9999",
      status: "approved",
      riskLevel: "low",
      timestamp: "2025-01-15 13:15:00",
      flags: [],
      description: "Regular monthly transfer",
    },
    {
      id: "TXN001234569",
      customer: "Mike Wilson",
      type: "Cash Withdrawal",
      amount: 9500.0,
      fromAccount: "****9012",
      toAccount: "ATM",
      status: "pending",
      riskLevel: "medium",
      timestamp: "2025-01-15 12:45:00",
      flags: ["Large Cash Withdrawal"],
      description: "ATM withdrawal - business account",
    },
    {
      id: "TXN001234570",
      customer: "Emma Davis",
      type: "Check Deposit",
      amount: 5000.0,
      fromAccount: "External",
      toAccount: "****3456",
      status: "approved",
      riskLevel: "low",
      timestamp: "2025-01-15 11:20:00",
      flags: [],
      description: "Mobile check deposit",
    },
    {
      id: "TXN001234571",
      customer: "Robert Brown",
      type: "Card Transaction",
      amount: 12000.0,
      fromAccount: "****7890",
      toAccount: "Luxury Store",
      status: "flagged",
      riskLevel: "high",
      timestamp: "2025-01-15 10:30:00",
      flags: ["Unusual Merchant", "High Amount"],
      description: "Credit card purchase - luxury goods",
    },
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesRisk = riskFilter === "all" || transaction.riskLevel === riskFilter

    return matchesSearch && matchesStatus && matchesRisk
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "flagged":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "pending":
        return Clock
      case "flagged":
        return AlertTriangle
      default:
        return Clock
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction Monitoring</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button size="sm">Review Flagged</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const StatusIcon = getStatusIcon(transaction.status)
            return (
              <div key={transaction.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      <StatusIcon className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{transaction.customer}</h3>
                        <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                          {transaction.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                        {transaction.flags.length > 0 && <Flag className="h-3 w-3 text-red-600" />}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>Transaction ID: {transaction.id}</div>
                        <div>
                          {transaction.fromAccount} → {transaction.toAccount}
                        </div>
                        <div>{transaction.description}</div>
                        <div>{new Date(transaction.timestamp).toLocaleString()}</div>
                      </div>

                      {transaction.flags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {transaction.flags.map((flag, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold">${transaction.amount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        Risk: <span className={getRiskColor(transaction.riskLevel)}>{transaction.riskLevel}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
