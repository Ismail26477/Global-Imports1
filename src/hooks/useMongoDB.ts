import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Order {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  product: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  sales: number;
  revenue: number;
  imageUrl?: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
  avgOrderValue: number;
  conversionRate: number;
  liveVisitors: number;
  pendingOrders: number;
  todayOrders: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed" | "refunded";
  date: string;
}

interface Refund {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  reason: string;
  status: "processed" | "pending";
  date: string;
}

interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  items: number;
  carrier: string;
  trackingId: string;
  status: "processing" | "in_transit" | "out_for_delivery" | "delivered" | "failed";
  estimatedDelivery: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  error?: string;
  message?: string;
}

interface NewProduct {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  imageUrl?: string;
}

interface UpdateProduct {
  sku: string;
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  reorderPoint?: number;
  imageUrl?: string;
}

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-api`;

async function fetchFromMongoDB<T>(action: string): Promise<T> {
  const response = await fetch(`${API_BASE}?action=${action}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${action}`);
  }

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Unknown error");
  }

  return result.data;
}

async function postToMongoDB<T, B extends object>(
  action: string,
  body: B
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
  });

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Unknown error");
  }

  return result;
}

export function useOrders() {
  return useQuery({
    queryKey: ["mongodb", "orders"],
    queryFn: () => fetchFromMongoDB<Order[]>("orders"),
    staleTime: 30000,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["mongodb", "products"],
    queryFn: () => fetchFromMongoDB<Product[]>("products"),
    staleTime: 30000,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["mongodb", "customers"],
    queryFn: () => fetchFromMongoDB<Customer[]>("customers"),
    staleTime: 30000,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["mongodb", "analytics"],
    queryFn: () => fetchFromMongoDB<Analytics>("analytics"),
    staleTime: 30000,
  });
}

export function useInventoryAlerts() {
  return useQuery({
    queryKey: ["mongodb", "inventory-alerts"],
    queryFn: () => fetchFromMongoDB<Product[]>("inventory-alerts"),
    staleTime: 30000,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ["mongodb", "top-products"],
    queryFn: () => fetchFromMongoDB<Product[]>("top-products"),
    staleTime: 30000,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["mongodb", "transactions"],
    queryFn: () => fetchFromMongoDB<Transaction[]>("transactions"),
    staleTime: 30000,
  });
}

export function useRefunds() {
  return useQuery({
    queryKey: ["mongodb", "refunds"],
    queryFn: () => fetchFromMongoDB<Refund[]>("refunds"),
    staleTime: 30000,
  });
}

export function useShipments() {
  return useQuery({
    queryKey: ["mongodb", "shipments"],
    queryFn: () => fetchFromMongoDB<Shipment[]>("shipments"),
    staleTime: 30000,
  });
}

export function usePendingFulfillment() {
  return useQuery({
    queryKey: ["mongodb", "pending-fulfillment"],
    queryFn: () => fetchFromMongoDB<Order[]>("pending-fulfillment"),
    staleTime: 30000,
  });
}

export function useCustomerOrders(email: string) {
  return useQuery({
    queryKey: ["mongodb", "customer-orders", email],
    queryFn: async () => {
      const result = await postToMongoDB<Order[], { email: string }>("customer-orders", { email });
      return result.data;
    },
    enabled: !!email,
    staleTime: 30000,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: NewProduct) =>
      postToMongoDB<Product, NewProduct>("add-product", product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mongodb", "products"] });
      queryClient.invalidateQueries({ queryKey: ["mongodb", "inventory-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["mongodb", "top-products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: UpdateProduct) =>
      postToMongoDB<Product, UpdateProduct>("update-product", product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mongodb", "products"] });
      queryClient.invalidateQueries({ queryKey: ["mongodb", "inventory-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["mongodb", "top-products"] });
    },
  });
}

export function useMongoDBStatus() {
  return useQuery({
    queryKey: ["mongodb", "status"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}?action=status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      return response.json();
    },
    staleTime: 60000,
  });
}

export async function initializeDatabase() {
  const response = await fetch(`${API_BASE}?action=init`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  return response.json();
}

export type { Order, Product, Customer, Analytics, NewProduct, UpdateProduct, Transaction, Refund, Shipment };
