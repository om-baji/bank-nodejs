import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, CreditCard, Building } from "lucide-react"

export function RecentTransactions() {
  const transactions = [
    {
      id: "1",
      type: "debit",
      description: "Amazon Purchase",
      amount: -89.99,
      date: "2025-01-15",
      category: "Shopping",
      icon: CreditCard,
      status: "completed",
    },
    {
      id: "2",
      type: "credit",
      description: "Salary Deposit",
      amount: 3500.0,
      date: "2025-01-15",
      category: "Income",
      icon: Building,
      status: "completed",
    },
    {
      id: "3",
      type: "debit",
      description: "Electric Bill",
      amount: -125.5,
      date: "2025-01-14",
      category: "Utilities",
      icon: CreditCard,
      status: "completed",
    },
    {
      id: "4",
      type: "debit",
      description: "Grocery Store",
      amount: -67.23,
      date: "2025-01-14",
      category: "Food",
      icon: CreditCard,
      status: "pending",
    },
    {
      id: "5",
      type: "credit",
      description: "Refund - Online Store",
      amount: 45.0,
      date: "2025-01-13",
      category: "Refund",
      icon: ArrowDownLeft,
      status: "completed",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "credit" ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.date} • {transaction.category}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "credit" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
