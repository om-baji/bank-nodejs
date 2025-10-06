import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, CreditCard } from "lucide-react"

export function ReportsSection() {
  const reports = [
    {
      id: "1",
      name: "Daily Transaction Summary",
      description: "Summary of all transactions processed today",
      type: "Daily",
      lastGenerated: "2025-01-15 23:59:00",
      status: "ready",
      icon: FileText,
    },
    {
      id: "2",
      name: "Customer Activity Report",
      description: "Detailed customer activity and engagement metrics",
      type: "Weekly",
      lastGenerated: "2025-01-14 08:00:00",
      status: "ready",
      icon: Users,
    },
    {
      id: "3",
      name: "Risk Assessment Report",
      description: "Analysis of high-risk transactions and customers",
      type: "Monthly",
      lastGenerated: "2025-01-01 09:00:00",
      status: "ready",
      icon: TrendingUp,
    },
    {
      id: "4",
      name: "Compliance Audit Report",
      description: "Regulatory compliance and audit trail documentation",
      type: "Quarterly",
      lastGenerated: "2024-12-31 10:00:00",
      status: "generating",
      icon: FileText,
    },
    {
      id: "5",
      name: "Loan Portfolio Analysis",
      description: "Performance analysis of loan portfolio",
      type: "Monthly",
      lastGenerated: "2025-01-01 11:00:00",
      status: "ready",
      icon: CreditCard,
    },
    {
      id: "6",
      name: "Deposit Growth Report",
      description: "Analysis of deposit growth and trends",
      type: "Monthly",
      lastGenerated: "2025-01-01 12:00:00",
      status: "ready",
      icon: DollarSign,
    },
  ]

  const quickStats = [
    {
      title: "Reports Generated Today",
      value: "12",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Scheduled Reports",
      value: "8",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Pending Reviews",
      value: "3",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Reports</CardTitle>
            <Button>Schedule New Report</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <report.icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{report.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                        <Badge variant={report.status === "ready" ? "default" : "secondary"} className="text-xs">
                          {report.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{report.description}</p>

                      <p className="text-xs text-muted-foreground">
                        Last generated: {new Date(report.lastGenerated).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {report.status === "ready" && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
