"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Settings, LogOut, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold text-primary">SecureBank</h1>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-sm font-medium">
                  Dashboard
                </Button>
              </Link>
              <Link href="/accounts">
                <Button variant="ghost" className="text-sm font-medium">
                  Accounts
                </Button>
              </Link>
              <Link href="/cards">
                <Button variant="ghost" className="text-sm font-medium">
                  Cards
                </Button>
              </Link>
              <Link href="/transfers">
                <Button variant="ghost" className="text-sm font-medium">
                  Transfers
                </Button>
              </Link>
              <Link href="/payments">
                <Button variant="ghost" className="text-sm font-medium">
                  Payments
                </Button>
              </Link>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                  3
                </span>
              </Button>
            </Link>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?key=hq4qp" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john.doe@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Security Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
