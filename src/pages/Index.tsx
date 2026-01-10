import { DashboardLayout } from "@/layouts/DashboardLayout"
import { KPICard } from "@/components/dashboard/KPICard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { InventoryAlerts } from "@/components/dashboard/InventoryAlerts"
import { QuickStats } from "@/components/dashboard/QuickStats"
import { useAnalytics, useMongoDBStatus } from "@/hooks/useMongoDB"
import { IndianRupee, ShoppingBag, Users, TrendingUp, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { APP_CONFIG } from "@/config/constants"

function formatRevenue(amount: number) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  return `₹${amount.toLocaleString("en-IN")}`
}

const Index = () => {
  const { data: analytics } = useAnalytics()
  const { data: dbStatus } = useMongoDBStatus()

  return (
    <DashboardLayout>
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 w-full">
        {/* Page Header - improved responsive spacing */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{APP_CONFIG.name}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{APP_CONFIG.tagline}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {dbStatus?.success && (
              <Badge variant="outline" className="gap-2 py-1 sm:py-1.5 text-xs w-fit">
                <Database className="w-3 h-3" />
                <span>MongoDB Connected</span>
              </Badge>
            )}
            <div className="text-xs sm:text-sm text-muted-foreground">
              Last updated: <span className="font-medium">Just now</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <QuickStats />

        {/* KPI Cards - 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          <KPICard
            title="Total Revenue"
            value={analytics ? formatRevenue(analytics.totalRevenue) : "₹0"}
            change={12.5}
            changeLabel="vs last month"
            icon={IndianRupee}
            variant="brand"
            className="stagger-1"
          />
          <KPICard
            title="Total Orders"
            value={analytics?.totalOrders?.toLocaleString() || "0"}
            change={8.2}
            changeLabel="vs last month"
            icon={ShoppingBag}
            variant="success"
            className="stagger-2"
          />
          <KPICard
            title="New Customers"
            value={analytics?.newCustomers?.toString() || "0"}
            change={-2.4}
            changeLabel="vs last month"
            icon={Users}
            variant="warning"
            className="stagger-3"
          />
          <KPICard
            title="Avg Order Value"
            value={analytics ? formatRevenue(analytics.avgOrderValue) : "₹0"}
            change={5.7}
            changeLabel="vs last month"
            icon={TrendingUp}
            variant="default"
            className="stagger-4"
          />
        </div>

        {/* Main Charts & Tables - stacked on mobile/tablet, side-by-side on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="lg:col-span-1">
            <InventoryAlerts />
          </div>
        </div>

        {/* Bottom Section - stacked on all breakpoints for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <RecentOrders />
          <TopProducts />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Index
