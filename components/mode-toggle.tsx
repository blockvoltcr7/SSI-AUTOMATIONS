"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon } from "lucide-react";
import { IconSunLow } from "@tabler/icons-react";
import { motion } from "framer-motion";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [localTheme, setLocalTheme] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = localTheme === "dark" ? "light" : "dark";
    setLocalTheme(newTheme);
    setTheme(newTheme);
  };

  if (localTheme === undefined) return null;

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex hover:bg-gray-50 dark:hover:bg-white/[0.1] rounded-lg items-center justify-center outline-none focus:ring-0 focus:outline-none active:ring-0 active:outline-none overflow-hidden"
    >
      <motion.div
        key={localTheme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {localTheme === "light" ? (
          <IconSunLow className="h-4 w-4 flex-shrink-0 text-neutral-700" />
        ) : (
          <MoonIcon className="h-4 w-4 flex-shrink-0 text-neutral-500" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
