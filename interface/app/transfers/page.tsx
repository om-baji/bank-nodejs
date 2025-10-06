import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TransferForm } from "@/components/transfers/transfer-form"
import { TransferHistory } from "@/components/transfers/transfer-history"
import { QuickTransfers } from "@/components/transfers/quick-transfers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransfersPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Money Transfers</h1>
            <p className="text-muted-foreground">
              Transfer money between accounts, send to others, and manage your transfer history
            </p>
          </div>

          <Tabs defaultValue="transfer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transfer">New Transfer</TabsTrigger>
              <TabsTrigger value="history">Transfer History</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            </TabsList>

            <TabsContent value="transfer" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <TransferForm />
                </div>
                <div>
                  <QuickTransfers />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <TransferHistory />
            </TabsContent>

            <TabsContent value="scheduled">
              <div>Scheduled transfers will go here</div>
            </TabsContent>

            <TabsContent value="beneficiaries">
              <div>Beneficiaries management will go here</div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
