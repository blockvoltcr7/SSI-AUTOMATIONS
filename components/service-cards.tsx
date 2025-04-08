"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  emoji: string;
  description: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ emoji, title, description, delay }) => {
  return (
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
        delay: delay,
      }}
      className="flex flex-col items-center p-5 sm:p-6 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-black/20 backdrop-blur-sm transition-all duration-300 text-center group hover:translate-y-[-5px]"
    >
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-all duration-300">{emoji}</div>
      <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
      <p className="text-base leading-relaxed text-neutral-400 max-w-xs">
        {description}
      </p>
    </motion.div>
  );
};

export const ServiceCards: React.FC = () => {
  const services = [
    {
      emoji: "🧠",
      title: "Voice AI Agents",
      description: "Human-like agents that answer customer calls, handle FAQs, and schedule appointments.",
      delay: 0.5,
    },
    {
      emoji: "⚙️",
      title: "Workflow Automation",
      description: "Eliminate manual processes like follow-ups, reminders, or emails with seamless backend automations.",
      delay: 0.6,
    },
    {
      emoji: "📅",
      title: "Appointment Setting Agents",
      description: "Qualify leads and sync with your calendar — no human assistant required.",
      delay: 0.7,
    },
  ];

  return (
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
        delay: 0.5,
      }}
      className="w-full max-w-6xl mx-auto mt-16 px-4 sm:px-6 md:px-8 relative z-10"
    >
      {/* Divider */}
      <div className="relative flex py-8 items-center">
        <div className="flex-grow border-t border-neutral-800"></div>
        <div className="flex-grow border-t border-neutral-800"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our AI-Powered Services</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto text-base md:text-lg">
          Cutting-edge solutions to streamline your business operations and enhance customer experience
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            emoji={service.emoji}
            title={service.title}
            description={service.description}
            delay={service.delay}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceCards; 