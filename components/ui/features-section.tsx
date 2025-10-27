"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  IconBrandYoutubeFilled,
  IconBrain,
  IconCalendar,
  IconRobot,
  IconGlobe,
} from "@tabler/icons-react";
import Link from "next/link";

export function FeaturesSection() {
  const features = [
    {
      title: "Voice AI Agents",
      description:
        "Human-like agents that answer customer calls, handle FAQs, and schedule appointments.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Workflow Automation",
      description:
        "Eliminate manual processes like follow-ups, reminders, or emails with seamless backend automations.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Learn more about our AI",
      description:
        "Watch how our AI solutions can transform your business operations and improve customer experience.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Appointment Setting Agents",
      description:
        "Qualify leads and sync with your calendar — no human assistant required.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 mx-auto max-w-7xl py-10 lg:py-40">
      <div className="px-8">
        <h4 className="mx-auto max-w-5xl text-center text-3xl font-medium tracking-tight text-black lg:text-5xl lg:leading-tight dark:text-white">
          Advanced AI Solutions for Your Business
        </h4>

        <p className="mx-auto my-4 max-w-2xl text-center text-sm font-normal text-neutral-500 lg:text-base dark:text-neutral-300">
          Automate your business operations, enhance customer experience, and
          boost efficiency with our cutting-edge AI technologies.
        </p>
      </div>

      <div className="relative">
        <div className="mt-12 grid grid-cols-1 rounded-md lg:grid-cols-6 xl:border dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`relative overflow-hidden p-4 sm:p-8`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="mx-auto max-w-5xl text-left text-xl tracking-tight text-black md:text-2xl md:leading-snug dark:text-white">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "mx-auto max-w-4xl text-left text-sm md:text-base",
        "text-center font-normal text-neutral-500 dark:text-neutral-300",
        "mx-0 my-2 max-w-sm text-left md:text-sm",
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex h-full gap-10 px-2 py-8">
      <div className="group mx-auto h-full w-full bg-white p-5 shadow-2xl dark:bg-neutral-900">
        <div className="flex h-full w-full flex-1 flex-col space-y-2">
          <Image
            src="/voice-ai-agents.jpg"
            alt="Voice AI Agents"
            width={800}
            height={800}
            className="aspect-square h-full w-full rounded-sm object-cover object-left-top"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-60 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-60 w-full bg-gradient-to-b from-white via-transparent to-transparent dark:from-black" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <Link
      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      target="__blank"
      className="group/image relative flex h-full gap-10"
    >
      <div className="group mx-auto h-full w-full bg-transparent dark:bg-transparent">
        <div className="relative flex h-full w-full flex-1 flex-col space-y-2">
          <IconBrandYoutubeFilled className="absolute inset-0 z-10 m-auto h-20 w-20 text-red-500" />
          <Image
            src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop"
            alt="AI Demo"
            width={800}
            height={800}
            className="aspect-square h-full w-full rounded-sm object-cover object-center blur-none transition-all duration-200 group-hover/image:blur-md"
          />
        </div>
      </div>
    </Link>
  );
};

export const SkeletonTwo = () => {
  const images = [
    "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop",
  ];

  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    // Generate random rotations once on client
    setRotations(images.map(() => Math.random() * 20 - 10));
  }, []);

  const imageVariants = {
    whileHover: { scale: 1.1, rotate: 0, zIndex: 100 },
    whileTap: { scale: 1.1, rotate: 0, zIndex: 100 },
  };

  return (
    <div className="relative flex h-full flex-col items-start gap-10 overflow-hidden p-8">
      <div className="-ml-20 flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{ rotate: rotations[idx] || 0 }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="-mr-4 mt-4 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <Image
              src={image}
              alt="workflow automation"
              width="500"
              height="500"
              className="h-20 w-20 flex-shrink-0 rounded-lg object-cover md:h-40 md:w-40"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{ rotate: rotations[idx] || 0 }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="-mr-4 mt-4 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <Image
              src={image}
              alt="workflow automation"
              width="500"
              height="500"
              className="h-20 w-20 flex-shrink-0 rounded-lg object-cover md:h-40 md:w-40"
            />
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-[100] h-full w-20 bg-gradient-to-r from-white to-transparent dark:from-black" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[100] h-full w-20 bg-gradient-to-l from-white to-transparent dark:from-black" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="relative mt-10 flex h-60 flex-col items-center bg-transparent md:h-60 dark:bg-transparent">
      <Globe className="absolute -bottom-80 -right-10 md:-bottom-72 md:-right-10" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="relative h-64 w-64 rounded-full bg-blue-100 bg-opacity-20 flex items-center justify-center dark:bg-blue-900 dark:bg-opacity-10">
        <IconGlobe className="h-32 w-32 text-blue-500" />
      </div>
    </div>
  );
};
