import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Eye, Clock, Target, Loader2 } from "lucide-react"
import { useAnalytics } from "@/hooks/useMongoDB"

export function QuickStats() {
  const { data: analytics, isLoading } = useAnalytics()

  const stats = [
    {
      label: "Live Visitors",
      value: analytics?.liveVisitors?.toString() || "0",
      icon: Eye,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Pending Orders",
      value: analytics?.pendingOrders?.toString() || "0",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Today's Orders",
      value: analytics?.todayOrders?.toString() || "0",
      icon: ShoppingCart,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Conversion Rate",
      value: analytics ? `${analytics.conversionRate}%` : "0%",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-3 sm:p-4 lg:p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-base font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
