"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Smartphone, CreditCard, DollarSign, Shield, AlertTriangle, Settings } from "lucide-react"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      address: "john.doe@email.com",
      transactions: true,
      security: true,
      marketing: false,
      statements: true,
    },
    sms: {
      enabled: true,
      number: "+1 (555) 123-4567",
      transactions: true,
      security: true,
      lowBalance: true,
    },
    push: {
      enabled: true,
      transactions: true,
      security: true,
      marketing: false,
    },
    preferences: {
      transactionThreshold: 1000,
      lowBalanceThreshold: 500,
      frequency: "immediate",
    },
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-enabled" className="text-base font-medium">
                Enable Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              id="email-enabled"
              checked={settings.email.enabled}
              onCheckedChange={(checked) => updateSetting("email", "enabled", checked)}
            />
          </div>

          {settings.email.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={settings.email.address}
                  onChange={(e) => updateSetting("email", "address", e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Email Preferences</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <Label>Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified of account transactions</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.email.transactions}
                      onCheckedChange={(checked) => updateSetting("email", "transactions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <div>
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Important security notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.email.security}
                      onCheckedChange={(checked) => updateSetting("email", "security", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <div>
                        <Label>Account Statements</Label>
                        <p className="text-sm text-muted-foreground">Monthly statement notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.email.statements}
                      onCheckedChange={(checked) => updateSetting("email", "statements", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-600" />
                      <div>
                        <Label>Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">Product updates and offers</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.email.marketing}
                      onCheckedChange={(checked) => updateSetting("email", "marketing", checked)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-enabled" className="text-base font-medium">
                Enable SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
            </div>
            <Switch
              id="sms-enabled"
              checked={settings.sms.enabled}
              onCheckedChange={(checked) => updateSetting("sms", "enabled", checked)}
            />
          </div>

          {settings.sms.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  value={settings.sms.number}
                  onChange={(e) => updateSetting("sms", "number", e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">SMS Preferences</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <div>
                        <Label>Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">High-value transactions</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.sms.transactions}
                      onCheckedChange={(checked) => updateSetting("sms", "transactions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <div>
                        <Label>Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Login attempts and security events</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.sms.security}
                      onCheckedChange={(checked) => updateSetting("sms", "security", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <div>
                        <Label>Low Balance Alerts</Label>
                        <p className="text-sm text-muted-foreground">When account balance is low</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.sms.lowBalance}
                      onCheckedChange={(checked) => updateSetting("sms", "lowBalance", checked)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-enabled" className="text-base font-medium">
                Enable Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications in your browser or mobile app</p>
            </div>
            <Switch
              id="push-enabled"
              checked={settings.push.enabled}
              onCheckedChange={(checked) => updateSetting("push", "enabled", checked)}
            />
          </div>

          {settings.push.enabled && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Transaction Notifications</Label>
                <Switch
                  checked={settings.push.transactions}
                  onCheckedChange={(checked) => updateSetting("push", "transactions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Security Notifications</Label>
                <Switch
                  checked={settings.push.security}
                  onCheckedChange={(checked) => updateSetting("push", "security", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Marketing Notifications</Label>
                <Switch
                  checked={settings.push.marketing}
                  onCheckedChange={(checked) => updateSetting("push", "marketing", checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="transaction-threshold">Transaction Alert Threshold</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="transaction-threshold"
                  type="number"
                  className="pl-10"
                  value={settings.preferences.transactionThreshold}
                  onChange={(e) =>
                    updateSetting("preferences", "transactionThreshold", Number.parseInt(e.target.value))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">Get notified for transactions above this amount</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="low-balance-threshold">Low Balance Alert Threshold</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="low-balance-threshold"
                  type="number"
                  className="pl-10"
                  value={settings.preferences.lowBalanceThreshold}
                  onChange={(e) => updateSetting("preferences", "lowBalanceThreshold", Number.parseInt(e.target.value))}
                />
              </div>
              <p className="text-sm text-muted-foreground">Get notified when balance falls below this amount</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-frequency">Notification Frequency</Label>
            <Select
              value={settings.preferences.frequency}
              onValueChange={(value) => updateSetting("preferences", "frequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1">Save Settings</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
