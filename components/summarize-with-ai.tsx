"use client";

import Image from "next/image";
import { useState } from "react";

interface SummarizeWithAIProps {
  pageUrl: string;
  pageTitle: string;
}

export function SummarizeWithAI({ pageUrl, pageTitle }: SummarizeWithAIProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const prompt = `Summarize this page briefly for a busy reader.
URL: ${pageUrl}
Title: ${pageTitle}
Return 5 bullet points plus 1 key takeaway.`;

    const encodedPrompt = encodeURIComponent(prompt);
    const chatGptUrl = `https://chat.openai.com/?q=${encodedPrompt}`;

    window.open(chatGptUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="border-t border-neutral-800 pt-6 mt-6 mb-8">
      <p className="text-sm text-neutral-400 mb-3 flex items-center gap-2">
        <span>💡</span>
        <span>Summarize with AI</span>
      </p>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neutral-800 hover:border-neutral-600 bg-neutral-900/50 backdrop-blur transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg group"
        aria-label="Summarize this blog post with ChatGPT"
      >
        <div className="relative w-6 h-6 flex-shrink-0">
          <Image
            src="/blog-icons/icons8-chatgpt-24.png"
            width={24}
            height={24}
            alt="ChatGPT"
            className="transition-transform duration-200 group-hover:scale-110"
          />
        </div>
        <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
          Summarize with ChatGPT
        </span>
        <svg
          className={`w-4 h-4 text-neutral-400 group-hover:text-white transition-all duration-200 ${
            isHovered ? "translate-x-1" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </button>
    </div>
  );
}