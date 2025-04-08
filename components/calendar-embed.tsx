"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function CalendarEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <div className="w-full h-[600px] relative">
      <Cal
        namespace="30min"
        calLink="sami-sabir-idrissi-couvnl/30min"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
} 