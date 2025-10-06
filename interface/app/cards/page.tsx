import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CardsList } from "@/components/cards/cards-list"
import { CardActions } from "@/components/cards/card-actions"
import { CardDetails } from "@/components/cards/card-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Card Management</h1>
            <p className="text-muted-foreground">
              Manage your debit and credit cards, view transactions, and control card settings
            </p>
          </div>

          <Tabs defaultValue="cards" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cards">My Cards</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <CardsList />
                </div>
                <div>
                  <CardActions />
                </div>
              </div>
              <CardDetails />
            </TabsContent>

            <TabsContent value="transactions">
              <div>Card transactions will go here</div>
            </TabsContent>

            <TabsContent value="rewards">
              <div>Rewards program will go here</div>
            </TabsContent>

            <TabsContent value="settings">
              <div>Card settings will go here</div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
