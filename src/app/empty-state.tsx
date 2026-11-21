
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wrench, CircleAlert } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  linkText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  supportLink?: string;
}

export default function EmptyState({
  title = "Something went wrong",
  description = "An unexpected error stopped this page from loading. It is not your fault, and your data is safe. Please try again.",
  image,
  link,
  linkText = "Back to Home",
  buttonText = "Try again",
  onButtonClick,
  supportLink = "mailto:support@example.com",
}: EmptyStateProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#f5f7fa] px-4">
      <Card className="w-full max-w-md border-0 shadow-none bg-transparent rounded-none p-6 text-center">

        {/* Error Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative flex items-center justify-center">
            <div className="w-[70px] h-[70px] rounded-full bg-orange-100 flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt="Error"
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-brand-navy" />
                </div>
              )}
            </div>

            {/* Error Badge */}
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center border-2 border-[#f5f7fa]">
              <CircleAlert className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#14243b] mb-2">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-[11px] leading-[17px] text-slate-500 max-w-[320px] mx-auto mb-5">
            {description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 mb-3">

          <Button
            onClick={onButtonClick}
            className="h-9 px-4 rounded-full bg-brand-orange text-brand-navy text-xs font-semibold shadow-md hover:bg-brand-orange/90"
          >
            {buttonText}
          </Button>

          {link && (
            <Button
              variant="outline"
              onClick={() => window.location.href = link}
              className="h-9 px-4 rounded-full border border-slate-200 bg-white text-[#14243b] text-xs font-medium hover:bg-slate-50"
            >
              {linkText}
            </Button>
          )}
        </div>

        {/* Error ID & Support */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
          <span>Error ID: ER-FA-21C</span>
          <span>·</span>
          <a
            href={supportLink}
            className="text-brand-navy underline font-medium hover:text-brand-orange"
          >
            Contact support
          </a>
        </div>

      </Card>
    </div>
  );
}
