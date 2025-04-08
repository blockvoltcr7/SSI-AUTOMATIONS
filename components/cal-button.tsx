"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalButtonProps {
  calLink?: string;
  className?: string;
  children: React.ReactNode;
}

export function CalButton({ 
  calLink = "sami-sabir-idrissi-couvnl/30min", 
  className,
  children
}: CalButtonProps) {
  useEffect(() => {
    (async function() {
      try {
        const cal = await getCalApi({"namespace":"30min"});
        cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
      } catch (error) {
        console.error("Error initializing Cal.com button:", error);
      }
    })();
  }, []);
  
  return (
    <button 
      data-cal-namespace="30min"
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view"}'
      className={className}
    >
      {children}
    </button>
  );
} 