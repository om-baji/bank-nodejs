"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, Eye, Edit, Lock, Unlock, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const customers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      accountNumber: "****1234",
      balance: 15420.5,
      status: "active",
      riskLevel: "low",
      joinDate: "2020-03-15",
      lastActivity: "2025-01-15",
      accountType: "Premium",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 234-5678",
      accountNumber: "****5678",
      balance: 8750.25,
      status: "active",
      riskLevel: "low",
      joinDate: "2021-06-10",
      lastActivity: "2025-01-14",
      accountType: "Standard",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+1 (555) 345-6789",
      accountNumber: "****9012",
      balance: 125000.0,
      status: "active",
      riskLevel: "medium",
      joinDate: "2019-11-22",
      lastActivity: "2025-01-13",
      accountType: "Business",
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 (555) 456-7890",
      accountNumber: "****3456",
      balance: 2100.75,
      status: "pending",
      riskLevel: "low",
      joinDate: "2025-01-10",
      lastActivity: "2025-01-12",
      accountType: "Standard",
    },
    {
      id: "5",
      name: "Robert Brown",
      email: "robert.brown@email.com",
      phone: "+1 (555) 567-8901",
      accountNumber: "****7890",
      balance: 0.0,
      status: "suspended",
      riskLevel: "high",
      joinDate: "2022-08-05",
      lastActivity: "2024-12-20",
      accountType: "Standard",
    },
  ]

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.accountNumber.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "suspended":
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Customer Management</CardTitle>
          <Button>Add New Customer</Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Customer List */}
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/generic-placeholder-graphic.png?key=${customer.id}`} alt={customer.name} />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{customer.name}</h3>
                      <Badge variant={getStatusColor(customer.status)} className="text-xs">
                        {customer.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {customer.accountType}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div>Account: {customer.accountNumber}</div>
                      <div>Joined: {new Date(customer.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold">${customer.balance.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      Risk: <span className={getRiskColor(customer.riskLevel)}>{customer.riskLevel}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last active: {new Date(customer.lastActivity).toLocaleDateString()}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {customer.status === "suspended" ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Reactivate Account
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Suspend Account
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No customers found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
