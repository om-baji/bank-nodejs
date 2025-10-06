import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary">SecureBank</h1>
              <p className="mt-2 text-muted-foreground">Professional Banking Solutions</p>
            </div>

            {/* Login Card */}
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
                <CardDescription>Access your secure banking dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 SecureBank. All rights reserved.</p>
              <p className="mt-1">Your security is our priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
