"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { HiArrowRight } from "react-icons/hi2";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Please enter your name",
    })
    .min(1, "Please enter your name"),
  email: z
    .string({
      required_error: "Please enter email",
    })
    .email("Please enter valid email")
    .min(1, "Please enter email"),
  webUrl: z
    .string()
    .refine(
      (val) => {
        if (val === "") return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid URL" }
    ),
  phone: z
    .string()
    .optional(),
  company: z
    .string({
      required_error: "Please enter your company's name",
    })
    .min(1, "Please enter your company's name"),
  serviceInterest: z
    .string()
    .optional(),
  timeline: z
    .string()
    .optional(),
  message: z
    .string({
      required_error: "Please enter your message",
    })
    .min(1, "Please enter your message"),
});

export type ContactFormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      webUrl: "",
      serviceInterest: "",
      timeline: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormData) {
    try {
      setSubmitStatus("Sending...");
      
      // Create a copy of values to modify
      const formData = { ...values };
      
      // Set default value for empty website URL
      if (!formData.webUrl || formData.webUrl.trim() === "") {
        formData.webUrl = "Website URL Not provided";
      }
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitStatus(data.message || "Message sent successfully!");
        form.reset();
      } else {
        const errorData = await response.json();
        setSubmitStatus(
          `Failed to send message: ${errorData.details || "Please try again."}`
        );
      }
    } catch (e) {
      setSubmitStatus("An error occurred. Please try again later.");
      console.error(e);
    }
  }

  const inputClasses = "block w-full bg-white dark:bg-neutral-800 px-4 rounded-lg border border-neutral-200 dark:border-neutral-700 py-2.5 shadow-sm text-black placeholder:text-neutral-400 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none sm:text-sm sm:leading-6 dark:text-white transition duration-200";
  const labelClasses = "block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-300";
  const errorClasses = "text-xs text-red-500 mt-1";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="name" className={labelClasses}>
                  Full Name *
                </label>
                <FormControl>
                  <input
                    id="name"
                    type="text"
                    className={inputClasses}
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={errorClasses} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="email" className={labelClasses}>
                  Email Address *
                </label>
                <FormControl>
                  <input
                    id="email"
                    type="email"
                    className={inputClasses}
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={errorClasses} />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="webUrl"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="webUrl" className={labelClasses}>
                  Website URL (Optional)
                </label>
                <FormControl>
                  <input
                    id="webUrl"
                    type="url"
                    className={inputClasses}
                    placeholder="https://example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={errorClasses} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="phone" className={labelClasses}>
                  Phone Number (Optional)
                </label>
                <FormControl>
                  <input
                    id="phone"
                    type="tel"
                    className={inputClasses}
                    placeholder="(123) 456-7890"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={errorClasses} />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="company" className={labelClasses}>
                  Company *
                </label>
                <FormControl>
                  <input
                    id="company"
                    type="text"
                    className={inputClasses}
                    placeholder="Your Company"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={errorClasses} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceInterest"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="serviceInterest" className={labelClasses}>
                  Service Interest
                </label>
                <FormControl>
                  <select
                    id="serviceInterest"
                    className={inputClasses}
                    {...field}
                  >
                    <option value="">What service are you interested in?</option>
                    <option value="Voice AI Agents">Voice AI Agents</option>
                    <option value="Workflow Automation">Workflow Automation</option>
                    <option value="Appointment Setting">Appointment Setting</option>
                    <option value="Multiple Services">Multiple Services</option>
                    <option value="Not Sure">Not Sure Yet</option>
                  </select>
                </FormControl>
                <FormMessage className={errorClasses} />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="timeline" className={labelClasses}>
                  Timeline
                </label>
                <FormControl>
                  <select
                    id="timeline"
                    className={inputClasses}
                    {...field}
                  >
                    <option value="">When do you need a solution?</option>
                    <option value="Immediately">Immediately</option>
                    <option value="1-3 months">Within 1-3 months</option>
                    <option value="3-6 months">Within 3-6 months</option>
                    <option value="6+ months">6+ months</option>
                    <option value="Just exploring">Just exploring options</option>
                  </select>
                </FormControl>
                <FormMessage className={errorClasses} />
              </FormItem>
            )}
          />
          <div></div>
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="message" className={labelClasses}>
                Message *
              </label>
              <FormControl>
                <textarea
                  rows={4}
                  id="message"
                  className={inputClasses}
                  placeholder="Tell us about your business needs and challenges"
                  {...field}
                />
              </FormControl>
              <FormMessage className={errorClasses} />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-black group"
              duration={1.5}
            >
              <span className="flex items-center justify-center py-2 px-4">
                <span className="mr-2">{form.formState.isSubmitting ? "Sending..." : "Send Message"}</span>
                <HiArrowRight className="text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-transform duration-200" />
              </span>
            </HoverBorderGradient>
          </button>
        </div>
        
        {submitStatus && (
          <div className={cn(
            "mt-4 text-sm p-3 rounded-lg",
            submitStatus.includes("successfully")
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          )}>
            {submitStatus}
          </div>
        )}
      </form>
    </Form>
  );
}
