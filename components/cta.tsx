"use client";
import React from "react";
import Link from "next/link";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { HiArrowRight } from "react-icons/hi2";

export const CTA = () => {
  return (
    <section className="py-20 w-full overflow-hidden relative z-30">
      <div className="bg-transparent">
        <div className="mx-auto w-full relative z-20 max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Want everything in one place?
            </h2>
            <p className="text-base md:text-lg text-neutral-400 mb-6">
              Browse all featured hubs on our Learn page.
            </p>

            <div className="flex justify-center">
              <Link href="/learn">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="bg-black group"
                  duration={1.5}
                >
                  <span className="mr-2">Explore Featured AI Hubs</span>
                  <HiArrowRight className="text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-transform duration-200" />
                </HoverBorderGradient>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
