"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HubCardProps {
  title: string;
  url: string;
  description: string;
  delay: number;
}

const HubCard: React.FC<HubCardProps> = ({
  title,
  url,
  description,
  delay,
}) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
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
      className="flex flex-col p-6 rounded-xl border border-neutral-800 hover:border-neutral-600 bg-black/30 backdrop-blur-sm transition-all duration-300 group hover:translate-y-[-5px] hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <span className="inline-block px-2 py-1 text-xs font-medium text-neutral-400 bg-neutral-800/50 rounded-md mb-3">
            Featured Hub
          </span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
        {title}
      </h3>

      <p className="text-base leading-relaxed text-neutral-400 flex-1">
        {description}
      </p>

      <div className="mt-4 flex items-center text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
        <span>Visit site</span>
        <svg
          className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </motion.a>
  );
};

export const HubCards: React.FC = () => {
  const hubs = [
    {
      title: "OpenAI Academy",
      url: "https://academy.openai.com/home",
      description:
        "Official OpenAI learning hub for GPTs, agents, safety, and AI workflows.",
      delay: 0.1,
    },
    {
      title: "Claude for Education (Anthropic)",
      url: "https://claude.com/solutions/education",
      description:
        "Responsible AI learning with Claude—advanced reasoning, safe integrations, and classroom resources.",
      delay: 0.2,
    },
    {
      title: "DeepLearning.ai",
      url: "https://www.deeplearning.ai/",
      description:
        "Industry-recognized AI courses from Andrew Ng and experts across the field.",
      delay: 0.3,
    },
    {
      title: "AI Engineer (Community)",
      url: "https://www.ai.engineer/",
      description:
        "The builder community for modern AI engineering—news, events, and practical resources.",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      {hubs.map((hub, index) => (
        <HubCard
          key={index}
          title={hub.title}
          url={hub.url}
          description={hub.description}
          delay={hub.delay}
        />
      ))}
    </div>
  );
};

export default HubCards;
