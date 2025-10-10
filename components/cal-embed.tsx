"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

export function CalEmbed({
  calLink = "sami-sabir-idrissi-couvnl/30min",
  className,
}: CalEmbedProps) {
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi({ namespace: "30min" });
        cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
      } catch (error) {
        console.error("Error initializing Cal.com:", error);
      }
    })();
  }, []);

  return (
    <div className={className}>
      <Cal
        namespace="30min"
        calLink={calLink}
        style={{ width: "100%", height: "600px", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
