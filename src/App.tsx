import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider } from "@/context/SidebarContext"
import Index from "./pages/Index"
import Orders from "./pages/Orders"
import Products from "./pages/Products"
import Customers from "./pages/Customers"
import Analytics from "./pages/Analytics"
import Marketing from "./pages/Marketing"
import Payments from "./pages/Payments"
import Fulfillment from "./pages/Fulfillment"
import Reviews from "./pages/Reviews"
import Discounts from "./pages/Discounts"
import Support from "./pages/Support"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import Help from "./pages/Help"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/fulfillment" element={<Fulfillment />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/support" element={<Support />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
