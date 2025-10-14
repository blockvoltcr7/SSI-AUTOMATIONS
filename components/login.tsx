"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Logo } from "./Logo";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Please enter email",
    })
    .email("Please enter valid email")
    .min(1, "Please enter email"),
});

export type LoginUser = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginUser>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [router]);

  async function onSubmit(values: LoginUser) {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createBrowserClient();

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      // Redirect to OTP page with email parameter
      router.push(`/otp?email=${encodeURIComponent(values.email)}`);
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <div className="flex items-center justify-between">
              <Logo />
              <div className="flex gap-4 text-sm">
                <Link
                  href="/"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/blog"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Enter your email to receive a verification code
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-neutral-700 dark:text-muted-dark"
                        >
                          Email address
                        </label>
                        <FormControl>
                          <div className="mt-2">
                            <input
                              id="email"
                              type="email"
                              placeholder="hello@johndoe.com"
                              className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5 shadow-aceternity text-black placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                )}

                <div>
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending code..." : "Send verification code"}
                  </Button>
                </div>
              </form>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center mt-8">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="text-neutral-500 dark:text-neutral-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-neutral-500 dark:text-neutral-300"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Form>
  );
}
