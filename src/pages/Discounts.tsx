import { useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Tag, 
  Plus, 
  Search,
  Filter,
  Copy,
  Trash2,
  Edit,
  Percent,
  IndianRupee,
  Calendar
} from "lucide-react";

const discounts = [
  {
    id: 1,
    code: "NEWYEAR24",
    type: "percentage",
    value: 15,
    minOrder: 5000,
    usageLimit: 100,
    usageCount: 67,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "active"
  },
  {
    id: 2,
    code: "GPU500OFF",
    type: "fixed",
    value: 500,
    minOrder: 10000,
    usageLimit: 50,
    usageCount: 23,
    startDate: "2024-01-05",
    endDate: "2024-01-15",
    status: "active"
  },
  {
    id: 3,
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrder: 2000,
    usageLimit: null,
    usageCount: 456,
    startDate: "2023-06-01",
    endDate: null,
    status: "active"
  },
  {
    id: 4,
    code: "FLASHSALE",
    type: "percentage",
    value: 25,
    minOrder: 15000,
    usageLimit: 200,
    usageCount: 200,
    startDate: "2023-12-25",
    endDate: "2023-12-26",
    status: "expired"
  },
  {
    id: 5,
    code: "SUMMER2024",
    type: "percentage",
    value: 20,
    minOrder: 8000,
    usageLimit: 500,
    usageCount: 0,
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    status: "scheduled"
  },
];

const Discounts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      scheduled: "secondary",
      expired: "outline",
      disabled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const activeDiscounts = discounts.filter(d => d.status === "active");
  const totalSavings = 125000; // Mock total savings from discounts
  const avgUsageRate = Math.round(
    discounts.reduce((sum, d) => sum + (d.usageLimit ? (d.usageCount / d.usageLimit) * 100 : 50), 0) / discounts.length
  );

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Discounts</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage discount codes and promotions
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Discount
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDiscounts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {discounts.reduce((sum, d) => sum + d.usageCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSavings)}</div>
              <p className="text-xs text-muted-foreground mt-1">Customer savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Usage Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgUsageRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Of limit used</p>
            </CardContent>
          </Card>
        </div>

        {/* Discounts Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Discounts</CardTitle>
                <CardDescription>Manage your discount codes</CardDescription>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search codes..."
                    className="pl-9 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                          {discount.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => navigator.clipboard.writeText(discount.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {discount.type === "percentage" ? (
                          <>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{discount.value}%</span>
                          </>
                        ) : (
                          <>
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{discount.value}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(discount.minOrder)}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{discount.usageCount}</span>
                        <span className="text-muted-foreground">
                          {discount.usageLimit ? ` / ${discount.usageLimit}` : " (unlimited)"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {discount.startDate} - {discount.endDate || "No end"}
                    </TableCell>
                    <TableCell>{getStatusBadge(discount.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Percentage Discount</h3>
                <p className="text-sm text-muted-foreground">e.g., 15% off entire order</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Fixed Amount</h3>
                <p className="text-sm text-muted-foreground">e.g., ₹500 off</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">Waive shipping charges</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Discounts;
