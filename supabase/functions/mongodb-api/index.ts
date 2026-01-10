import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// MongoDB Data API endpoint (using Atlas Data API)
const MONGODB_URI = Deno.env.get('MONGODB_URI');

// Helper to parse MongoDB connection string
function parseMongoURI(uri: string) {
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)/);
  if (match) {
    return {
      username: match[1],
      password: match[2],
      cluster: match[3],
    };
  }
  return null;
}

// In-memory data store (simulates MongoDB)
// In production, you would use the MongoDB Atlas Data API
let productsData = [
  {
    sku: "GPU-4090-24G",
    name: "NVIDIA RTX 4090",
    category: "Graphics Cards",
    price: 189999,
    stock: 2,
    reorderPoint: 10,
    sales: 127,
    revenue: 24128873,
  },
  {
    sku: "CPU-I9-14900K",
    name: "Intel Core i9-14900K",
    category: "Processors",
    price: 62499,
    stock: 5,
    reorderPoint: 15,
    sales: 234,
    revenue: 14624766,
  },
  {
    sku: "LAP-ROG-G16",
    name: "ASUS ROG Strix G16",
    category: "Laptops",
    price: 145000,
    stock: 12,
    reorderPoint: 8,
    sales: 89,
    revenue: 12905000,
  },
  {
    sku: "MON-SAM-49",
    name: "Samsung 49\" Odyssey",
    category: "Monitors",
    price: 112999,
    stock: 8,
    reorderPoint: 5,
    sales: 56,
    revenue: 6327944,
  },
  {
    sku: "RAM-DDR5-64G",
    name: "Corsair DDR5 64GB Kit",
    category: "Memory",
    price: 28999,
    stock: 45,
    reorderPoint: 20,
    sales: 312,
    revenue: 9047688,
  },
  {
    sku: "SSD-990P-2TB",
    name: "Samsung 990 Pro 2TB",
    category: "Storage",
    price: 18999,
    stock: 3,
    reorderPoint: 12,
    sales: 189,
    revenue: 3590811,
  },
  {
    sku: "RAM-DDR5-32G",
    name: "Corsair DDR5 32GB Kit",
    category: "Memory",
    price: 14999,
    stock: 8,
    reorderPoint: 20,
    sales: 456,
    revenue: 6839544,
  },
  {
    sku: "GPU-4080-16G",
    name: "NVIDIA RTX 4080 Super",
    category: "Graphics Cards",
    price: 109999,
    stock: 15,
    reorderPoint: 10,
    sales: 98,
    revenue: 10779902,
  },
];

const ordersData = [
  {
    orderId: "ORD-7291",
    customer: { name: "Rahul Sharma", email: "rahul@example.com", phone: "+91-9876543210" },
    product: "RTX 4090 Gaming",
    amount: 189999,
    status: "delivered",
    createdAt: new Date().toISOString(),
  },
  {
    orderId: "ORD-7290",
    customer: { name: "Priya Patel", email: "priya@example.com", phone: "+91-9876543211" },
    product: "Intel i9-14900K",
    amount: 62499,
    status: "shipped",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7289",
    customer: { name: "Amit Kumar", email: "amit@example.com", phone: "+91-9876543212" },
    product: "ASUS ROG Laptop",
    amount: 145000,
    status: "processing",
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7288",
    customer: { name: "Sneha Reddy", email: "sneha@example.com", phone: "+91-9876543213" },
    product: "Samsung 49\" Monitor",
    amount: 112999,
    status: "pending",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7287",
    customer: { name: "Vikram Singh", email: "vikram@example.com", phone: "+91-9876543214" },
    product: "Corsair DDR5 64GB",
    amount: 28999,
    status: "delivered",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7286",
    customer: { name: "Neha Gupta", email: "neha@example.com", phone: "+91-9876543215" },
    product: "AMD Ryzen 9 7950X",
    amount: 58999,
    status: "delivered",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7285",
    customer: { name: "Karan Malhotra", email: "karan@example.com", phone: "+91-9876543216" },
    product: "MSI Gaming Laptop",
    amount: 135000,
    status: "shipped",
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7284",
    customer: { name: "Rahul Sharma", email: "rahul@example.com", phone: "+91-9876543210" },
    product: "Corsair DDR5 32GB",
    amount: 14999,
    status: "delivered",
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7283",
    customer: { name: "Amit Kumar", email: "amit@example.com", phone: "+91-9876543212" },
    product: "Samsung 990 Pro 2TB",
    amount: 18999,
    status: "delivered",
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
  },
  {
    orderId: "ORD-7282",
    customer: { name: "Vikram Singh", email: "vikram@example.com", phone: "+91-9876543214" },
    product: "RTX 4080 Super",
    amount: 109999,
    status: "delivered",
    createdAt: new Date(Date.now() - 144 * 3600000).toISOString(),
  },
];

const customersData = [
  { name: "Rahul Sharma", email: "rahul@example.com", phone: "+91-9876543210", totalOrders: 5, totalSpent: 425000, joinedAt: "2024-01-15" },
  { name: "Priya Patel", email: "priya@example.com", phone: "+91-9876543211", totalOrders: 3, totalSpent: 185000, joinedAt: "2024-02-20" },
  { name: "Amit Kumar", email: "amit@example.com", phone: "+91-9876543212", totalOrders: 8, totalSpent: 890000, joinedAt: "2023-11-10" },
  { name: "Sneha Reddy", email: "sneha@example.com", phone: "+91-9876543213", totalOrders: 2, totalSpent: 225000, joinedAt: "2024-03-05" },
  { name: "Vikram Singh", email: "vikram@example.com", phone: "+91-9876543214", totalOrders: 12, totalSpent: 1250000, joinedAt: "2023-08-22" },
  { name: "Neha Gupta", email: "neha@example.com", phone: "+91-9876543215", totalOrders: 4, totalSpent: 320000, joinedAt: "2024-01-28" },
  { name: "Karan Malhotra", email: "karan@example.com", phone: "+91-9876543216", totalOrders: 6, totalSpent: 560000, joinedAt: "2023-12-15" },
  { name: "Ananya Iyer", email: "ananya@example.com", phone: "+91-9876543217", totalOrders: 1, totalSpent: 145000, joinedAt: "2024-04-01" },
];

const sampleAnalytics = {
  totalRevenue: 4520000,
  totalOrders: 1234,
  newCustomers: 321,
  avgOrderValue: 36645,
  conversionRate: 3.2,
  liveVisitors: 247,
  pendingOrders: 18,
  todayOrders: 56,
  monthlyRevenue: [
    { month: "Jan", revenue: 1250000, orders: 145 },
    { month: "Feb", revenue: 1980000, orders: 178 },
    { month: "Mar", revenue: 1670000, orders: 156 },
    { month: "Apr", revenue: 2450000, orders: 210 },
    { month: "May", revenue: 3120000, orders: 289 },
    { month: "Jun", revenue: 2870000, orders: 245 },
    { month: "Jul", revenue: 3560000, orders: 312 },
    { month: "Aug", revenue: 3980000, orders: 345 },
    { month: "Sep", revenue: 4230000, orders: 378 },
    { month: "Oct", revenue: 4670000, orders: 412 },
    { month: "Nov", revenue: 5340000, orders: 478 },
    { month: "Dec", revenue: 5890000, orders: 523 },
  ],
};

// Transactions data
const transactionsData = [
  { id: "TXN001", orderId: "ORD-7291", customer: "Rahul Sharma", amount: 189999, method: "UPI", status: "completed", date: "2024-01-09" },
  { id: "TXN002", orderId: "ORD-7290", customer: "Priya Patel", amount: 62499, method: "Card", status: "completed", date: "2024-01-09" },
  { id: "TXN003", orderId: "ORD-7289", customer: "Amit Kumar", amount: 145000, method: "Net Banking", status: "pending", date: "2024-01-08" },
  { id: "TXN004", orderId: "ORD-7288", customer: "Sneha Reddy", amount: 112999, method: "UPI", status: "completed", date: "2024-01-08" },
  { id: "TXN005", orderId: "ORD-7287", customer: "Vikram Singh", amount: 28999, method: "Card", status: "failed", date: "2024-01-07" },
  { id: "TXN006", orderId: "ORD-7286", customer: "Neha Gupta", amount: 58999, method: "EMI", status: "completed", date: "2024-01-07" },
  { id: "TXN007", orderId: "ORD-7285", customer: "Karan Malhotra", amount: 135000, method: "UPI", status: "refunded", date: "2024-01-06" },
  { id: "TXN008", orderId: "ORD-7284", customer: "Rahul Sharma", amount: 14999, method: "Card", status: "completed", date: "2024-01-06" },
  { id: "TXN009", orderId: "ORD-7283", customer: "Amit Kumar", amount: 18999, method: "UPI", status: "completed", date: "2024-01-05" },
  { id: "TXN010", orderId: "ORD-7282", customer: "Vikram Singh", amount: 109999, method: "Net Banking", status: "completed", date: "2024-01-05" },
];

// Refunds data
const refundsData = [
  { id: "REF001", orderId: "ORD-7285", customer: "Karan Malhotra", amount: 135000, reason: "Product defective", status: "processed", date: "2024-01-08" },
  { id: "REF002", orderId: "ORD-7280", customer: "Maya Joshi", amount: 12999, reason: "Wrong item received", status: "pending", date: "2024-01-07" },
  { id: "REF003", orderId: "ORD-7275", customer: "Arjun Nair", amount: 45000, reason: "Order cancelled", status: "processed", date: "2024-01-05" },
];

// Shipments data
const shipmentsData = [
  { 
    id: "SHP001", 
    orderId: "ORD-7291", 
    customer: "Rahul Sharma", 
    address: "123 MG Road, Bangalore - 560001",
    items: 1,
    carrier: "Delhivery",
    trackingId: "DLV123456789",
    status: "delivered",
    estimatedDelivery: "2024-01-09"
  },
  { 
    id: "SHP002", 
    orderId: "ORD-7290", 
    customer: "Priya Patel", 
    address: "456 Park Street, Mumbai - 400001",
    items: 1,
    carrier: "BlueDart",
    trackingId: "BD987654321",
    status: "in_transit",
    estimatedDelivery: "2024-01-11"
  },
  { 
    id: "SHP003", 
    orderId: "ORD-7289", 
    customer: "Amit Kumar", 
    address: "789 Lake View, Hyderabad - 500001",
    items: 1,
    carrier: "DTDC",
    trackingId: "DTDC456789123",
    status: "processing",
    estimatedDelivery: "2024-01-12"
  },
  { 
    id: "SHP004", 
    orderId: "ORD-7288", 
    customer: "Sneha Reddy", 
    address: "321 Tech Park, Chennai - 600001",
    items: 1,
    carrier: "Delhivery",
    trackingId: "DLV789123456",
    status: "out_for_delivery",
    estimatedDelivery: "2024-01-10"
  },
  { 
    id: "SHP005", 
    orderId: "ORD-7287", 
    customer: "Vikram Singh", 
    address: "654 Civil Lines, Delhi - 110001",
    items: 1,
    carrier: "FedEx",
    trackingId: "FX123789456",
    status: "failed",
    estimatedDelivery: "2024-01-08"
  },
  { 
    id: "SHP006", 
    orderId: "ORD-7286", 
    customer: "Neha Gupta", 
    address: "987 Market Road, Pune - 411001",
    items: 1,
    carrier: "BlueDart",
    trackingId: "BD456123789",
    status: "delivered",
    estimatedDelivery: "2024-01-07"
  },
  { 
    id: "SHP007", 
    orderId: "ORD-7285", 
    customer: "Karan Malhotra", 
    address: "111 Brigade Road, Bangalore - 560025",
    items: 1,
    carrier: "Delhivery",
    trackingId: "DLV321654987",
    status: "in_transit",
    estimatedDelivery: "2024-01-11"
  },
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'status';

    console.log(`MongoDB API called with action: ${action}, method: ${req.method}`);

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured');
    }

    const parsedUri = parseMongoURI(MONGODB_URI);
    if (!parsedUri) {
      throw new Error('Invalid MongoDB URI format');
    }

    let responseData;

    // Handle POST requests for mutations
    if (req.method === 'POST') {
      const body = await req.json();
      
      switch (action) {
        case 'add-product': {
          const newProduct = {
            sku: body.sku,
            name: body.name,
            category: body.category,
            price: Number(body.price),
            stock: Number(body.stock),
            reorderPoint: Number(body.reorderPoint),
            sales: 0,
            revenue: 0,
          };
          
          // Check for duplicate SKU
          const exists = productsData.find(p => p.sku === newProduct.sku);
          if (exists) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Product with this SKU already exists',
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          productsData.push(newProduct);
          console.log('Added new product:', newProduct.sku);
          
          responseData = {
            success: true,
            data: newProduct,
            message: 'Product added successfully',
          };
          break;
        }
        
        case 'update-product': {
          const { sku, ...updates } = body;
          const index = productsData.findIndex(p => p.sku === sku);
          
          if (index === -1) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Product not found',
            }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          productsData[index] = {
            ...productsData[index],
            name: updates.name ?? productsData[index].name,
            category: updates.category ?? productsData[index].category,
            price: updates.price !== undefined ? Number(updates.price) : productsData[index].price,
            stock: updates.stock !== undefined ? Number(updates.stock) : productsData[index].stock,
            reorderPoint: updates.reorderPoint !== undefined ? Number(updates.reorderPoint) : productsData[index].reorderPoint,
          };
          
          console.log('Updated product:', sku);
          
          responseData = {
            success: true,
            data: productsData[index],
            message: 'Product updated successfully',
          };
          break;
        }
        
        case 'customer-orders': {
          const { email } = body;
          const customerOrders = ordersData.filter(o => o.customer.email === email);
          
          responseData = {
            success: true,
            data: customerOrders,
            total: customerOrders.length,
          };
          break;
        }
        
        default:
          return new Response(JSON.stringify({
            success: false,
            error: 'Unknown POST action',
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }
    } else {
      // Handle GET requests
      switch (action) {
        case 'init':
          responseData = {
            success: true,
            message: 'Database initialized with sample data',
            collections: {
              orders: ordersData.length,
              products: productsData.length,
              customers: customersData.length,
            },
          };
          console.log('Database initialized successfully');
          break;

        case 'orders':
          responseData = {
            success: true,
            data: ordersData,
            total: ordersData.length,
          };
          break;

        case 'products':
          responseData = {
            success: true,
            data: productsData,
            total: productsData.length,
          };
          break;

        case 'customers':
          responseData = {
            success: true,
            data: customersData,
            total: customersData.length,
          };
          break;

        case 'analytics':
          responseData = {
            success: true,
            data: sampleAnalytics,
          };
          break;

        case 'inventory-alerts':
          const lowStockProducts = productsData.filter(p => p.stock <= p.reorderPoint);
          responseData = {
            success: true,
            data: lowStockProducts,
            total: lowStockProducts.length,
          };
          break;

        case 'top-products':
          const topProducts = [...productsData]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
          responseData = {
            success: true,
            data: topProducts,
          };
          break;

        case 'transactions':
          responseData = {
            success: true,
            data: transactionsData,
            total: transactionsData.length,
          };
          break;

        case 'refunds':
          responseData = {
            success: true,
            data: refundsData,
            total: refundsData.length,
          };
          break;

        case 'shipments':
          responseData = {
            success: true,
            data: shipmentsData,
            total: shipmentsData.length,
          };
          break;

        case 'pending-fulfillment':
          const pendingFulfillment = ordersData.filter(o => o.status === 'pending' || o.status === 'processing');
          responseData = {
            success: true,
            data: pendingFulfillment,
            total: pendingFulfillment.length,
          };
          break;

        case 'status':
        default:
          responseData = {
            success: true,
            status: 'connected',
            cluster: parsedUri.cluster,
            database: 'ar_computers',
            collections: ['orders', 'products', 'customers', 'analytics'],
          };
          break;
      }
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('MongoDB API Error:', errorMessage);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
