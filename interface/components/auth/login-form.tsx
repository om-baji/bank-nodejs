"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"user" | "manager">("user")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: ""
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
          role: userType.toUpperCase()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      // Redirect based on user type
      if (userType === "manager") {
        router.push("/manager/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        <Label htmlFor="usernameOrEmail">Email or Username</Label>
        <Input
          id="usernameOrEmail"
          type="text"
          placeholder="Enter your email or username"
          value={formData.usernameOrEmail}
          onChange={(e) => handleChange("usernameOrEmail", e.target.value)}
          required
          className="h-11"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
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

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Signup Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an accounst?{" "}
          <a href="/signup" className="text-primary font-medium hover:underline">
            Sign up now
          </a>
        </p>
      </div>
    </form>
  )
}
