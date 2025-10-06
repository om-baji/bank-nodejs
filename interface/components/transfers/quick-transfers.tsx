import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Plus, Clock, Star } from "lucide-react"

export function QuickTransfers() {
  const frequentRecipients = [
    {
      id: "1",
      name: "John Smith",
      email: "john@email.com",
      lastAmount: 500.0,
      avatar: "/placeholder.svg?key=js",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      lastAmount: 250.0,
      avatar: "/placeholder.svg?key=sj",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@email.com",
      lastAmount: 100.0,
      avatar: "/placeholder.svg?key=mw",
    },
  ]

  const quickAmounts = [50, 100, 250, 500, 1000]

  return (
    <div className="space-y-6">
      {/* Quick Amounts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Amounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {quickAmounts.map((amount) => (
              <Button key={amount} variant="outline" className="h-12 bg-transparent">
                ${amount}
              </Button>
            ))}
            <Button variant="outline" className="h-12 col-span-2 bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Custom Amount
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Frequent Recipients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-4 w-4" />
            Frequent Recipients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {frequentRecipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={recipient.avatar || "/placeholder.svg"} alt={recipient.name} />
                    <AvatarFallback>
                      {recipient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{recipient.name}</p>
                    <p className="text-xs text-muted-foreground">{recipient.email}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add Recipient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transfers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Transfers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>To Savings Account</span>
              <span className="font-medium">$1,000</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>From John Smith</span>
              <span className="font-medium text-green-600">+$500</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Rent Payment</span>
              <span className="font-medium">$1,200</span>
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View All History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
