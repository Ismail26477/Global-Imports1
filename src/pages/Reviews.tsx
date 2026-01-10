import { useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

const reviews = [
  {
    id: 1,
    customer: "Rajesh Kumar",
    product: "NVIDIA RTX 4090",
    rating: 5,
    title: "Excellent performance!",
    content: "Best GPU I've ever used. The performance is incredible and runs all games at max settings smoothly.",
    date: "2024-01-08",
    status: "approved",
    helpful: 24
  },
  {
    id: 2,
    customer: "Priya Sharma",
    product: "Corsair Vengeance 32GB RAM",
    rating: 4,
    title: "Good quality RAM",
    content: "Works perfectly with my AMD build. Good speeds and no issues so far.",
    date: "2024-01-07",
    status: "pending",
    helpful: 8
  },
  {
    id: 3,
    customer: "Amit Patel",
    product: "Samsung 990 Pro SSD",
    rating: 5,
    title: "Lightning fast!",
    content: "Incredible read/write speeds. Windows boots in seconds. Highly recommended.",
    date: "2024-01-06",
    status: "approved",
    helpful: 45
  },
  {
    id: 4,
    customer: "Sneha Reddy",
    product: "AMD Ryzen 9 7950X",
    rating: 3,
    title: "Good but runs hot",
    content: "Great performance but needs a good cooler. Stock performance is okay.",
    date: "2024-01-05",
    status: "approved",
    helpful: 12
  },
  {
    id: 5,
    customer: "Vikram Singh",
    product: "Logitech MX Master 3S",
    rating: 5,
    title: "Best mouse ever",
    content: "Ergonomic, precise, and the battery lasts forever. Worth every penny.",
    date: "2024-01-04",
    status: "approved",
    helpful: 32
  },
];

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive"; icon: React.ReactNode }> = {
      approved: { variant: "default", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      pending: { variant: "secondary", icon: <Clock className="h-3 w-3 mr-1" /> },
      flagged: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
    };
    const { variant, icon } = config[status] || config.pending;
    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {status}
      </Badge>
    );
  };

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const filteredReviews = reviews.filter(
    (r) =>
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer reviews and feedback
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
              <div className="flex mt-1">{renderStars(Math.round(avgRating))}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter(r => r.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting moderation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <Progress value={92} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-4 text-sm">{stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Progress value={percentage} className="flex-1" />
                  <span className="w-8 text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest customer feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.customer}</span>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{review.product}</p>
                    <p className="text-sm mt-2 line-clamp-2">{review.content}</p>
                  </div>
                  {getStatusBadge(review.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>All Reviews</CardTitle>
                    <CardDescription>View and moderate customer reviews</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reviews..."
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
              <CardContent className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {review.customer.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.customer}</p>
                          <p className="text-sm text-muted-foreground">{review.product}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {getStatusBadge(review.status)}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-medium">{review.title}</p>
                      <p className="text-muted-foreground mt-1">{review.content}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          {review.helpful} helpful
                        </span>
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {reviews.filter(r => r.status === "pending").length} reviews pending moderation
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {reviews.filter(r => r.status === "approved").length} approved reviews
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reviews;
