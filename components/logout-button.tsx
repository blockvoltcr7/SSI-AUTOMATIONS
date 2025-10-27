"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action="/api/auth/signout" method="post">
      <Button
        type="submit"
        variant="outline"
        className="gap-2"
      >
        <LogOutIcon className="h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
}
