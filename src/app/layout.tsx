import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

import { ToastProvider } from "@/lib/toast";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = "https://fixmate-client24.vercel.app";

const title = "FixMate — Verified Device & Appliance Repair Services";
const description =
  "Book verified local technicians for smartphone, laptop, AC, refrigerator, TV, washing machine and electrical repairs. Track every job step by step and pay only after the work is completed.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "FixMate",
  title: {
    default: title,
    template: "%s | FixMate",
  },
  description,
  keywords: [
    "FixMate",
    "repair service",
    "device repair",
    "appliance repair",
    "verified technicians",
    "smartphone repair",
    "laptop repair",
    "AC servicing",
    "home services",
    "pay after service",
  ],
  authors: [{ name: "FixMate" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "FixMate",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
       
        <ToastProvider>
          {children}
        </ToastProvider>
        
      </body>
    </html>
  );
}
