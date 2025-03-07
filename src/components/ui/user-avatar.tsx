import React from "react"
import { User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function UserAvatar() {
  return (
    <Avatar className="h-8 w-8 bg-blue-600">
      <AvatarFallback className="bg-blue-600 text-white">
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  )
}

