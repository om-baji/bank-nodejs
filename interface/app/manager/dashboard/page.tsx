import { ManagerHeader } from "@/components/manager/manager-header"
import { ManagerOverview } from "@/components/manager/manager-overview"
import { CustomerManagement } from "@/components/manager/customer-management"
import { TransactionMonitoring } from "@/components/manager/transaction-monitoring"
import { ReportsSection } from "@/components/manager/reports-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManagerDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <ManagerHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor operations, manage customers, and oversee banking activities
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ManagerOverview />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerManagement />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionMonitoring />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsSection />
            </TabsContent>

            <TabsContent value="alerts">
              <div>Alert management will go here</div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
