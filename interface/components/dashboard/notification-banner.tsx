"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, X } from "lucide-react"
import { useState } from "react"

export function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>New Feature:</strong> You can now set up automatic savings transfers.
          <Button variant="link" className="p-0 h-auto text-blue-600 underline ml-1">
            Learn more
          </Button>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
