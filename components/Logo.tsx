"use client";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  // const handleLogoClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };
  return (
    <Link
      href="/"
      // onClick={handleLogoClick}
    >
      <span className="font-medium text-black dark:text-white">
        SSI Automations
      </span>
    </Link>
  );
};
