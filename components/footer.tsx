import Link from "next/link";
import React from "react";
import { Logo } from "./Logo";

export const Footer = () => {
  const links = [{ name: "Contact", href: "/contact" }];

  return (
    <footer className="bg-white dark:bg-black border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start">
            <Logo />
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              Automating your business with AI-powered solutions.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-center items-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            &copy; 2024 SSI AUTOMATIONS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
