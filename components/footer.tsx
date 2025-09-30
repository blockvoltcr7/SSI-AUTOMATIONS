import Link from "next/link";
import React from "react";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start">
            <Logo />
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              Your AI Learning Hub.
            </p>
          </div>

          <div className="flex flex-col md:items-center">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Pages</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                Terms
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
