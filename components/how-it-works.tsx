"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TracingBeam } from "@/components/ui/tracing-beam";

interface StepProps {
  emoji: string;
  title: string;
  description: string;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ emoji, title, description, stepNumber }) => {
  return (
    <div className="flex gap-4 md:gap-6 group relative">
      {/* Step number and connector line - now managed by TracingBeam */}
      <div className="flex flex-col items-center relative">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 text-white font-bold text-lg z-10 group-hover:border-blue-500 transition-all duration-300 shadow-lg"
        >
          {stepNumber}
        </motion.div>
      </div>
      
      {/* Step content */}
      <div className="pb-12 relative">
        <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{emoji}</div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
        <p className="text-base leading-relaxed text-neutral-400 max-w-md group-hover:text-neutral-300 transition-colors duration-300">
          {description}
        </p>
        
        {/* Hidden highlight on hover */}
        <div className="absolute -left-6 -top-3 -bottom-3 -right-12 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      emoji: "📞",
      title: "Book a Free Strategy Call",
      description: "Tell us about your business and goals.",
    },
    {
      emoji: "🧠",
      title: "We Recommend the Right AI Agents",
      description: "Based on your needs, we design a custom voice agent + automation plan.",
    },
    {
      emoji: "✅",
      title: "You Approve the Setup",
      description: "You review everything before launch — we'll make any adjustments needed.",
    },
    {
      emoji: "🚀",
      title: "AI Workers Go Live",
      description: "Your voice agent, workflows, and automations are deployed.",
    },
    {
      emoji: "📈",
      title: "Watch Your Business Grow",
      description: "While your 24/7 AI team handles customer calls, bookings, and backend tasks.",
    }
  ];

  return (
    <div id="how-it-works" className="w-full max-w-6xl mx-auto mt-20 px-4 sm:px-6 md:px-8 relative z-10">
      {/* Divider */}
      <div className="relative flex py-8 items-center">
        <div className="flex-grow border-t border-neutral-800"></div>
        <span className="mx-4 flex-shrink-0 text-neutral-500">●</span>
        <div className="flex-grow border-t border-neutral-800"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-base md:text-lg">
          Our simple process to get your AI agents and automations up and running
        </p>
      </motion.div>
      
      <TracingBeam className="w-full">
        <div className="pl-4 md:pl-10 lg:pl-16 relative">
          {steps.map((step, index) => (
            <Step
              key={index}
              emoji={step.emoji}
              title={step.title}
              description={step.description}
              stepNumber={index + 1}
            />
          ))}
        </div>
      </TracingBeam>
    </div>
  );
};

export default HowItWorks; 