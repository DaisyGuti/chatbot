import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` otherwise appends a managed block to CLAUDE.md when it detects a coding agent.
  // CLAUDE.md is a hard deliverable here and is owned by hand — nothing writes to it but us.
  agentRules: false,
};

export default nextConfig;
