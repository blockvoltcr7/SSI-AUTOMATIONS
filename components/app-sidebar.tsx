"use client"

import * as React from "react"
import type { User } from "@supabase/supabase-js"
import {
  LayoutDashboardIcon,
  BarChartIcon,
  BookOpenIcon,
  NewspaperIcon,
  SettingsIcon,
  HomeIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Extract user information for display
  const isWeb3User = user.app_metadata?.provider === "web3"
  const walletAddress = user.user_metadata?.custom_claims?.address

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return null
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Prepare user data for NavUser component
  const userData = {
    name: isWeb3User && walletAddress
      ? formatAddress(walletAddress) || "Web3 User"
      : user.email?.split('@')[0] || "User",
    email: user.email || (isWeb3User ? "Web3 Wallet" : ""),
    avatar: "/avatars/default.jpg",
  }

  // Navigation items for SSI Automations
  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChartIcon,
    },
  ]

  const navSecondary = [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Blog",
      url: "/blog",
      icon: BookOpenIcon,
    },
    {
      title: "Newsletter",
      url: "/newsletter",
      icon: NewspaperIcon,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-white">
                    <span className="text-lg font-bold">S</span>
                  </div>
                  <span className="text-base font-semibold">SSI Automations</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
