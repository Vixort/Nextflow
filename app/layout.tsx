import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ActivityTrackerProvider } from "@/components/ActivityTrackerProvider";
import { getGeneralSettings } from "@/lib/auth/securitySettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let platformName = "NEXTFLOW"
  try {
    const general = await getGeneralSettings()
    platformName = general.platform_name || platformName
  } catch {
    // fall back to the default name
  }
  return {
    title: {
      default: `${platformName} — Real-time Workflow Platform`,
      template: `%s | ${platformName}`,
    },
    description: "Next-generation workflow automation and SaaS platform",
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ActivityTrackerProvider>
          {children}
        </ActivityTrackerProvider>
      </body>
    </html>
  );
}
