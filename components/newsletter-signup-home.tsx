"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { motion, AnimatePresence } from "framer-motion";

export function NewsletterSignupHome() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const placeholders = [
    "Enter your email address...",
    "your.email@example.com",
    "Stay updated with AI learning resources",
    "Get weekly curated content",
    "Join our AI learning community",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // TODO: Integrate with backend API
    setSubmitted(true);

    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 5000);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-4">
      <div className="w-full">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 w-full max-w-xl"
          >
            <div className="flex items-start gap-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-1">
                  Successfully Subscribed!
                </h4>
                <p className="text-sm text-neutral-400">
                  Thank you for subscribing to our AI Learning Newsletter.
                  You'll receive curated content, course updates, and learning
                  tips straight to your inbox.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
