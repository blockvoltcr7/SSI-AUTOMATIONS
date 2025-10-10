"use client";
import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { HiArrowRight } from "react-icons/hi2";

export function HoverBorderGradientDemo() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="p-8 bg-neutral-950 rounded-xl">
        <HoverBorderGradient
          containerClassName="rounded-full"
          className="bg-black group"
          duration={1.5}
        >
          <span className="mr-2">📅 Book Free Strategy Call</span>
          <HiArrowRight className="text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-transform duration-200" />
        </HoverBorderGradient>
      </div>

      <div className="p-8 bg-white rounded-xl">
        <HoverBorderGradient
          containerClassName="rounded-full"
          className="bg-white text-black group"
          duration={1.5}
        >
          <span className="mr-2">📅 Book Free Strategy Call</span>
          <HiArrowRight className="text-black group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-transform duration-200" />
        </HoverBorderGradient>
      </div>
    </div>
  );
}
