"use client";

import React from "react";
import Image from "next/image";
import { SlidingLogoMarquee, SlidingLogoMarqueeItem } from "@/components/lightswind/sliding-logo-marquee";

const logos = [
  { id: "github",     src: "/github.png",     alt: "GitHub",     invert: false },
  { id: "gitlab",     src: "/gitlab-cn-logo.png",      alt: "GitLab",     invert: false },
  { id: "databricks", src: "/databricks.png", alt: "Databricks", invert: false },
  { id: "atlassian",  src: "/atlassian-com-logo.png",  alt: "Atlassian",  invert: false },
  { id: "slack",      src: "/slack-com-logo.png",      alt: "Slack",      invert: false },
  { id: "snowflake",  src: "/snowflake.jpg",           alt: "Snowflake",  invert: false },
  { id: "sonarqube",  src: "/sonarQube.png",           alt: "SonarQube",  invert: false },
];

export function IntegrationsShowcase() {
  const items: SlidingLogoMarqueeItem[] = logos.map((logo) => ({
    id: logo.id,
    content: (
      <div className="flex items-center justify-center px-4 group">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={160}
          height={56}
          style={{ width: "auto" }}
          className={`h-25 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300${logo.invert ? " dark:invert" : ""}`}
        />
      </div>
    ),
  }));

  return (
    <section className="bg-background py-20 border-t border-border overflow-hidden" id="integrations">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-6">

        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-foreground">
            Orchestrate Your Entire Dev Stack
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Synchropia integrates directly with your active repository managers, cloud infrastructure nodes, alerting services, and analytics suites.
          </p>
        </div>

        {/* Single Horizontal Sliding Logo Marquee */}
        <div className="w-full">
          <SlidingLogoMarquee
            items={items}
            speed={20}
            height="140px"
            gap="5rem"
            showControls={false}
            pauseOnHover={true}
            enableBlur={true}
            showGridBackground={true}
            className="py-2"
          />
        </div>

      </div>
    </section>
  );
}
