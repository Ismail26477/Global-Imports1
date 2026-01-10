import { useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  Check,
  Clock
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Order #ARC-2024-015 from Rajesh Kumar for ₹45,999",
    time: "5 minutes ago",
    read: false
  },
  {
    id: 2,
    type: "alert",
    title: "Low Stock Alert",
    message: "NVIDIA RTX 4080 is running low (3 units remaining)",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    type: "order",
    title: "Order Delivered",
    message: "Order #ARC-2024-012 has been successfully delivered",
    time: "2 hours ago",
    read: false
  },
  {
    id: 4,
    type: "info",
    title: "Weekly Report Ready",
    message: "Your weekly sales report for Jan 1-7 is ready to view",
    time: "5 hours ago",
    read: true
  },
  {
    id: 5,
    type: "alert",
    title: "Payment Failed",
    message: "Payment for order #ARC-2024-010 failed. Customer notified.",
    time: "1 day ago",
    read: true
  },
  {
    id: 6,
    type: "success",
    title: "Refund Processed",
    message: "Refund of ₹28,500 for order #ARC-2024-007 has been processed",
    time: "1 day ago",
    read: true
  },
  {
    id: 7,
    type: "order",
    title: "New Order Received",
    message: "Order #ARC-2024-014 from Priya Sharma for ₹32,500",
    time: "2 days ago",
    read: true
  },
  {
    id: 8,
    type: "info",
    title: "System Update",
    message: "Dashboard has been updated with new features",
    time: "3 days ago",
    read: true
  },
];

const Notifications = () => {
  const [notificationList, setNotificationList] = useState(notifications);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotificationList(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your store activity
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notificationList.filter(n => n.type === "order").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Order updates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notificationList.filter(n => n.type === "alert").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationList.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All notifications</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>Your recent activity and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {notificationList.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                      notification.read ? "bg-background" : "bg-primary/5 border border-primary/10"
                    }`}
                  >
                    <div className="p-2 rounded-full bg-muted">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {notificationList.filter(n => n.type === "order").length} order notifications
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {notificationList.filter(n => n.type === "alert").length} alerts
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {notificationList.filter(n => n.type === "info" || n.type === "success").length} system notifications
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
