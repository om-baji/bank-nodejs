"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, CreditCard, DollarSign, Shield, AlertTriangle, CheckCircle, Info, Trash2 } from "lucide-react"

export function NotificationsList() {
  const [filter, setFilter] = useState("all")
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "transaction",
      title: "Large Transaction Alert",
      message: "A transaction of $5,000 was processed from your Primary Checking account.",
      timestamp: "2025-01-15T14:30:00Z",
      read: false,
      priority: "high",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "2",
      type: "security",
      title: "Login from New Device",
      message: "We detected a login from a new device in New York, NY. If this wasn't you, please secure your account.",
      timestamp: "2025-01-15T13:15:00Z",
      read: false,
      priority: "high",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "3",
      type: "card",
      title: "Card Payment Processed",
      message: "Your SecureBank Platinum card was charged $89.99 at Amazon.com.",
      timestamp: "2025-01-15T12:45:00Z",
      read: true,
      priority: "medium",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "4",
      type: "account",
      title: "Monthly Statement Available",
      message: "Your January 2025 account statement is now available for download.",
      timestamp: "2025-01-15T09:00:00Z",
      read: true,
      priority: "low",
      icon: Info,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      id: "5",
      type: "security",
      title: "Password Changed Successfully",
      message: "Your account password was successfully updated on January 14, 2025.",
      timestamp: "2025-01-14T16:20:00Z",
      read: true,
      priority: "medium",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "6",
      type: "transaction",
      title: "Low Balance Alert",
      message: "Your Primary Checking account balance is below $500. Consider transferring funds.",
      timestamp: "2025-01-14T08:30:00Z",
      read: false,
      priority: "medium",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: "7",
      type: "card",
      title: "Card Locked Successfully",
      message: "Your SecureBank Debit card has been locked as requested.",
      timestamp: "2025-01-13T19:45:00Z",
      read: true,
      priority: "high",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "8",
      type: "account",
      title: "Direct Deposit Received",
      message: "A direct deposit of $3,500.00 has been added to your Primary Checking account.",
      timestamp: "2025-01-13T06:00:00Z",
      read: true,
      priority: "medium",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ])

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="card">Cards</SelectItem>
                <SelectItem value="account">Account</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                !notification.read ? "bg-accent/20 border-primary/20" : "hover:bg-accent/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${notification.bgColor}`}>
                  <notification.icon className={`h-4 w-4 ${notification.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>{notification.title}</h3>
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                    <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                      {notification.priority}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>

                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 px-2"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 px-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
