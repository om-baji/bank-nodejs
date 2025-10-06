"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Search, Download } from "lucide-react"

export function TransferHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const transfers = [
    {
      id: "1",
      type: "outgoing",
      method: "internal",
      description: "Transfer to Savings",
      fromAccount: "Primary Checking ****1234",
      toAccount: "High Yield Savings ****5678",
      amount: 1000.0,
      date: "2025-01-15",
      status: "completed",
      reference: "TXN001234567",
    },
    {
      id: "2",
      type: "incoming",
      method: "external",
      description: "From John Smith",
      fromAccount: "External Account",
      toAccount: "Primary Checking ****1234",
      amount: 500.0,
      date: "2025-01-14",
      status: "completed",
      reference: "TXN001234568",
    },
    {
      id: "3",
      type: "outgoing",
      method: "external",
      description: "Rent Payment",
      fromAccount: "Primary Checking ****1234",
      toAccount: "Property Management Co.",
      amount: 1200.0,
      date: "2025-01-13",
      status: "pending",
      reference: "TXN001234569",
    },
    {
      id: "4",
      type: "outgoing",
      method: "wire",
      description: "International Wire",
      fromAccount: "Business Account ****9012",
      toAccount: "Overseas Supplier",
      amount: 5000.0,
      fee: 25.0,
      date: "2025-01-12",
      status: "completed",
      reference: "WIRE001234570",
    },
    {
      id: "5",
      type: "outgoing",
      method: "internal",
      description: "Emergency Fund",
      fromAccount: "Primary Checking ****1234",
      toAccount: "High Yield Savings ****5678",
      amount: 2000.0,
      date: "2025-01-10",
      status: "failed",
      reference: "TXN001234571",
    },
  ]

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter
    const matchesType = typeFilter === "all" || transfer.method === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transfer History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transfers..."
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
              <SelectItem value="wire">Wire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transfer List */}
        <div className="space-y-4">
          {filteredTransfers.map((transfer) => (
            <div key={transfer.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transfer.type === "incoming" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transfer.type === "incoming" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{transfer.description}</h3>
                      <Badge variant="outline" className="text-xs">
                        {transfer.method}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>From: {transfer.fromAccount}</p>
                      <p>To: {transfer.toAccount}</p>
                      <p>Ref: {transfer.reference}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-lg font-semibold ${
                      transfer.type === "incoming" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transfer.type === "incoming" ? "+" : "-"}${transfer.amount.toFixed(2)}
                    {transfer.fee && (
                      <span className="text-sm text-muted-foreground ml-1">(+${transfer.fee.toFixed(2)} fee)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {new Date(transfer.date).toLocaleDateString()}
                    </span>
                    <Badge variant={getStatusColor(transfer.status)} className="text-xs">
                      {transfer.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransfers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transfers found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
