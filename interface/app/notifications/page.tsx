import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { NotificationSettings } from "@/components/notifications/notification-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your account activity and manage notification preferences
            </p>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">All Notifications</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <NotificationsList />
            </TabsContent>

            <TabsContent value="settings">
              <NotificationSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
