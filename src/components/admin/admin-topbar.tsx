"use client";

import { LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function AdminTopbar({ userName }: { userName: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="lg:ml-0 ml-12">
        <h2 className="text-sm font-medium text-gray-600">Welcome back,</h2>
        <p className="text-sm font-semibold text-gray-900">{userName}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-medium text-white">
          {userName.charAt(0).toUpperCase()}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-gray-500 hover:text-gray-700"
        >
          <LogOut className="mr-1 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
