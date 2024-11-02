import React from "react";
import Marquee from "react-fast-marquee";

const LogoCloudMarquee = ({
  title = "We Love These Tools",
  logos = [
    { name: "Crewai", src: "/logos/crewai.png" },
    { name: "Google", src: "/logos/google.webp" },
    { name: "Meta", src: "/logos/meta.png" },
    { name: "Vercel", src: "/logos/vercel.png" },
    { name: "claude", src: "/logos/claude.webp" },
  ],
  speed = 30,
  direction = "left" as const,
}) => {
  return (
    <div className="relative">
      <p className="text-center text-base text-neutral-700 font-sans dark:text-neutral-300 mt-4">
        {title}
      </p>

      <div className="flex gap-10 h-20 flex-wrap justify-center md:gap-40 relative w-full mt-4 md:mt-2 max-w-4xl mx-auto [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <Marquee pauseOnHover direction={direction} speed={speed}>
          {logos.map((logo) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              className="md:w-40 w-32 object-contain mx-0 md:mx-10 dark:invert"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default LogoCloudMarquee;
