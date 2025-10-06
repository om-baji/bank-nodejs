"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Shield } from "lucide-react"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"user" | "manager">("user")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect based on user type
    if (userType === "manager") {
      window.location.href = "/manager/dashboard"
    } else {
      window.location.href = "/dashboard"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="userType">Account Type</Label>
        <Select value={userType} onValueChange={(value: "user" | "manager") => setUserType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Personal Banking</SelectItem>
            <SelectItem value="manager">Manager Access</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Username/Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email or Username</Label>
        <Input id="email" type="text" placeholder="Enter your email or username" required className="h-11" />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            className="h-11 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm">
        <Shield className="h-4 w-4 text-accent" />
        <span className="text-muted-foreground">Your connection is secured with 256-bit encryption</span>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In Securely"}
      </Button>

      {/* Additional Links */}
      <div className="text-center space-y-2">
        <Button variant="link" className="text-sm text-muted-foreground">
          Forgot your password?
        </Button>
        <div className="text-xs text-muted-foreground">
          Need help? Contact support at <span className="text-accent">support@securebank.com</span>
        </div>
      </div>
    </form>
  )
}
