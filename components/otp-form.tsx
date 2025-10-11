"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

interface OTPFormProps extends React.ComponentProps<typeof Card> {
  email: string;
}

export function OTPForm({ email, ...props }: OTPFormProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);

      const supabase = createBrowserClient();

      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    try {
      setIsResending(true);
      setError(null);
      setSuccessMessage(null);

      const supabase = createBrowserClient();

      const { error: resendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (resendError) {
        setError(resendError.message);
        return;
      }

      setSuccessMessage("A new code has been sent to your email");
      setOtp("");
    } catch (e) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {email}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            {successMessage && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            )}

            <FieldGroup>
              <Button type="submit" disabled={isVerifying || otp.length !== 6}>
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
              <FieldDescription className="text-center">
                Didn&apos;t receive the code?{" "}
                <a
                  href="#"
                  onClick={handleResend}
                  className="text-neutral-900 dark:text-neutral-100 font-medium hover:underline"
                >
                  {isResending ? "Sending..." : "Resend"}
                </a>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
