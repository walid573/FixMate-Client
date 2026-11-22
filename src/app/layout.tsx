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

export const metadata: Metadata = {
  title: {
    default: "FixMate — Verified Repair Services",
    template: "%s | FixMate",
  },
  description:
    "Book trusted local technicians for phone, laptop, AC and appliance repairs. Track your job and pay after completion.",
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
