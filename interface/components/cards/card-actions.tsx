import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Smartphone, FileText, Settings, AlertTriangle, Plus } from "lucide-react"

export function CardActions() {
  const actions = [
    {
      icon: Plus,
      label: "Request New Card",
      description: "Apply for a new card",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      icon: Lock,
      label: "Lock/Unlock Card",
      description: "Secure your card instantly",
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100",
    },
    {
      icon: Smartphone,
      label: "Add to Digital Wallet",
      description: "Use with Apple/Google Pay",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      icon: FileText,
      label: "View Statements",
      description: "Download card statements",
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
    {
      icon: Settings,
      label: "Card Settings",
      description: "Manage preferences",
      color: "text-gray-600",
      bgColor: "bg-gray-50 hover:bg-gray-100",
    },
    {
      icon: AlertTriangle,
      label: "Report Lost/Stolen",
      description: "Emergency card services",
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Actions</CardTitle>
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
