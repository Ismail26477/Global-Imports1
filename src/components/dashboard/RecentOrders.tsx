import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOrders } from "@/hooks/useMongoDB"

const statusStyles = {
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    label: "Pending",
  },
  processing: {
    bg: "bg-info/10",
    text: "text-info",
    label: "Processing",
  },
  shipped: {
    bg: "bg-primary/10",
    text: "text-primary",
    label: "Shipped",
  },
  delivered: {
    bg: "bg-success/10",
    text: "text-success",
    label: "Delivered",
  },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours} hours ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

export function RecentOrders() {
  const { data: orders, isLoading, error } = useOrders()

  return (
    <Card className="animate-fade-in stagger-3">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
        <CardTitle className="text-base sm:text-lg font-semibold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary gap-1 w-fit">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">Failed to load orders</div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders?.slice(0, 5).map((order) => {
              const status = statusStyles[order.status]
              return (
                <div
                  key={order.orderId}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        #{order.orderId} • {order.product}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 text-right">
                    <div>
                      <p className="font-semibold text-sm">{formatCurrency(order.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(order.createdAt)}</p>
                    </div>
                    <Badge className={cn("text-xs font-medium flex-shrink-0", status.bg, status.text, "border-0")}>
                      {status.label}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
