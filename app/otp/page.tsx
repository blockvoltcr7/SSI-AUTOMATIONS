"use client";

import { OTPForm } from "@/components/otp-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function OTPPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  useEffect(() => {
    // Redirect to login if no email is provided
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OTPForm email={email} />
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <OTPPageContent />
    </Suspense>
  );
}
