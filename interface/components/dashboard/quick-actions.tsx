import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, ArrowUpDown, CreditCard, PiggyBank, FileText, Phone } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: Send,
      label: "Transfer Money",
      description: "Send money to accounts",
      color: "text-blue-600",
    },
    {
      icon: ArrowUpDown,
      label: "Pay Bills",
      description: "Pay your bills online",
      color: "text-green-600",
    },
    {
      icon: CreditCard,
      label: "Manage Cards",
      description: "View and control cards",
      color: "text-purple-600",
    },
    {
      icon: PiggyBank,
      label: "Open Savings",
      description: "Start saving today",
      color: "text-orange-600",
    },
    {
      icon: FileText,
      label: "Statements",
      description: "Download statements",
      color: "text-indigo-600",
    },
    {
      icon: Phone,
      label: "Contact Support",
      description: "Get help anytime",
      color: "text-red-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50 bg-transparent"
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <div className="text-center">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
