import type { NextConfig } from "next";

const securityHeaders = [
  // Frame protection: allow same-origin embedding only. This is required
  // because the template preview iframe renders /api/templates/... (self).
  // Cross-origin sites still cannot frame us (clickjacking prevention).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME-sniffing of responses.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Strict referrer leakage control.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Cross-origin isolation for resources we fetch (Supabase, AI providers).
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  // CSP: pragmatic, non-breaking for the existing UI (Puck/recharts use
  // inline styles; dev/next may inject inline scripts).
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https://vaojqressfghrlpgllno.supabase.co https://generativelanguage.googleapis.com https://openrouter.ai https://api.openai.com https://api.groq.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;