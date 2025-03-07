import React from "react";
import { Bot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function BotAvatar() {
  return (
    <Avatar className="h-8 w-8 bg-slate-700">
      <AvatarFallback className="bg-slate-700 text-white">
        <Bot className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  )
}

