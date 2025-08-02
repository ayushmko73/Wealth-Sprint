"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Disabled to prevent auto-popup notifications
  // Return null to completely disable toast notifications
  return null
}

export { Toaster }
