"use client";

import { Button } from "./button";
import { HiArrowRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";
import { useState } from "react";

export const Hero = () => {
  const router = useRouter();
  const words = [
    { text: "Automate" },
    { text: "Your" },
    { text: "Business" },
    { text: "with" },
    { text: "AI-Powered" },
    { text: "Solutions" },
  ];

  const [typewriterComplete, setTypewriterComplete] = useState(false);

  return (
    <div className="flex flex-col min-h-screen pt-20 md:pt-40 relative overflow-hidden">
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
          duration: 0.5,
        }}
        className="flex justify-center"
      >
        {/* <Badge onClick={() => router.push("/blog/top-5-llm-of-all-time")}>
          We&apos;ve raised $69M seed funding
        </Badge> */}
      </motion.div>
      <TypewriterEffect
        words={words}
        className="mt-6"
        onComplete={() => setTypewriterComplete(true)}
      />
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
          duration: 0.5,
          delay: 0.2,
        }}
        className="text-center mt-6 text-base md:text-xl text-muted dark:text-muted-dark max-w-3xl mx-auto relative z-10"
      >
        {typewriterComplete && (
          <TextGenerateEffect words="Empower your business to harness the power of AI and transform your operations for greater efficiency and success." />
        )}
      </motion.div>
      <motion.div
        initial={{
          y: 80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.4,
        }}
        className="flex items-center gap-4 justify-center mt-6 relative z-10"
      >
        <Button
          variant="simple"
          as={Link}
          href="/contact"
          className="flex space-x-2 items-center group"
        >
          <span>Contact us</span>
          <HiArrowRight className="text-muted group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-transform duration-200 dark:text-muted-dark" />
        </Button>
      </motion.div>
    </div>
  );
};
