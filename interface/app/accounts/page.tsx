import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AccountsList } from "@/components/accounts/accounts-list"
import { AccountDetails } from "@/components/accounts/account-details"
import { AccountActions } from "@/components/accounts/account-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
            <p className="text-muted-foreground">Manage your accounts, view statements, and control account settings</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="statements">Statements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <AccountsList />
                </div>
                <div>
                  <AccountActions />
                </div>
              </div>
              <AccountDetails />
            </TabsContent>

            <TabsContent value="statements">
              <div>Statements content will go here</div>
            </TabsContent>

            <TabsContent value="settings">
              <div>Settings content will go here</div>
            </TabsContent>

            <TabsContent value="beneficiaries">
              <div>Beneficiaries content will go here</div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
