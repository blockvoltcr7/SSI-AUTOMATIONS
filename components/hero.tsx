"use client";

import { HiArrowRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-32 md:pt-48 pb-20 relative overflow-hidden">
      <motion.h1
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.6,
        }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-white max-w-5xl mx-auto relative z-10"
      >
        Discover the best places to learn AI.
      </motion.h1>

      <motion.p
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.6,
          delay: 0.1,
        }}
        className="text-center mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto relative z-10"
      >
        Curated links to world-class academies and communities—kept simple.
      </motion.p>

      <motion.div
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.6,
          delay: 0.2,
        }}
        className="flex items-center gap-4 justify-center mt-8 relative z-10"
      >
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
      </motion.div>
    </div>
  );
};
