import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

export function ManagerOverview() {
  const metrics = [
    {
      title: "Total Customers",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Deposits",
      value: "$45.2M",
      change: "+8.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Loans",
      value: "$23.8M",
      change: "+3.2%",
      trend: "up",
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Pending Approvals",
      value: "47",
      change: "-15%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const alerts = [
    {
      id: "1",
      type: "high",
      title: "Suspicious Transaction Detected",
      description: "Large cash withdrawal flagged for review",
      customer: "John Smith",
      amount: "$15,000",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "medium",
      title: "Account Verification Required",
      description: "Customer documentation needs review",
      customer: "Sarah Johnson",
      time: "4 hours ago",
    },
    {
      id: "3",
      type: "low",
      title: "System Maintenance Scheduled",
      description: "Planned downtime this weekend",
      time: "1 day ago",
    },
  ]

  const recentActivities = [
    {
      id: "1",
      type: "approval",
      description: "Loan application approved",
      customer: "Mike Wilson",
      amount: "$50,000",
      time: "1 hour ago",
      status: "completed",
    },
    {
      id: "2",
      type: "account",
      description: "New account opened",
      customer: "Emma Davis",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: "3",
      type: "transaction",
      description: "Wire transfer processed",
      customer: "Robert Brown",
      amount: "$25,000",
      time: "5 hours ago",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Priority Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Priority Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge
                          variant={
                            alert.type === "high" ? "destructive" : alert.type === "medium" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      {alert.customer && (
                        <p className="text-sm font-medium mt-1">
                          Customer: {alert.customer}
                          {alert.amount && <span className="ml-2 text-muted-foreground">({alert.amount})</span>}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.customer}
                        {activity.amount && <span className="ml-2">• {activity.amount}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="text-xs mb-1">
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
