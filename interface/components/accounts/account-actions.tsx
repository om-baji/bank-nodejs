import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Download, Settings, Plus, CreditCard, FileText, Bell } from "lucide-react"

export function AccountActions() {
  const actions = [
    {
      icon: Send,
      label: "Transfer Money",
      description: "Send money between accounts",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      icon: Download,
      label: "Download Statement",
      description: "Get your latest statement",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      icon: Settings,
      label: "Account Settings",
      description: "Manage account preferences",
      color: "text-gray-600",
      bgColor: "bg-gray-50 hover:bg-gray-100",
    },
    {
      icon: Plus,
      label: "Open New Account",
      description: "Start a new account",
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
    {
      icon: CreditCard,
      label: "Order Checks",
      description: "Order new checkbooks",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
    },
    {
      icon: FileText,
      label: "Tax Documents",
      description: "Access tax forms",
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
    },
    {
      icon: Bell,
      label: "Set Alerts",
      description: "Manage notifications",
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <Button key={index} variant="ghost" className={`w-full justify-start h-auto p-3 ${action.bgColor}`}>
              <action.icon className={`mr-3 h-5 w-5 ${action.color}`} />
              <div className="text-left">
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
