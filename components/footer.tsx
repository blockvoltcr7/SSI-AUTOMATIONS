import Link from "next/link";
import React from "react";
import { Logo } from "./Logo";

export const Footer = () => {

  return (
    <footer className="bg-white dark:bg-black border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              Automating your business with AI-powered solutions.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Company</h3>
            <div className="space-y-2">
              <Link 
                href="/about" 
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Legal</h3>
            <div className="space-y-2">
              <Link 
                href="/privacy" 
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-center items-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            &copy; 2025 SSI AUTOMATIONS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
