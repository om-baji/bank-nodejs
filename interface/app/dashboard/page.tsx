import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AccountOverview } from "@/components/dashboard/account-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AccountCards } from "@/components/dashboard/account-cards"
import { NotificationBanner } from "@/components/dashboard/notification-banner"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Notification Banner */}
        <NotificationBanner />

        {/* Account Overview */}
        <AccountOverview />

        {/* Quick Actions */}
        <QuickActions />

        {/* Account Cards */}
        <AccountCards />

        {/* Recent Transactions */}
        <RecentTransactions />
      </main>
    </div>
  )
}
