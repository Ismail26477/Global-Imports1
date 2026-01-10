"use client"

import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 1024
      setIsMobile(isNowMobile)
      // Close mobile drawer when transitioning to desktop
      if (!isNowMobile) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isSidebarExpanded = isMobile && sidebarOpen ? true : !desktopCollapsed

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - only visible on lg+ */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-auto">
        <DashboardSidebar collapsed={desktopCollapsed} setCollapsed={setDesktopCollapsed} isMobileDrawer={false} />
      </div>

      {/* Mobile Sidebar Overlay - improved overlay */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar Drawer - slide in from left, always expanded */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <DashboardSidebar collapsed={false} setCollapsed={() => {}} isMobileDrawer={true} />
        </div>
      )}

      {/* Main Content Container */}
      <div
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300",
          // Only add sidebar padding on desktop (lg and above)
          "lg:pl-64",
          desktopCollapsed && "lg:pl-[72px]",
        )}
      >
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 w-full overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
