"use client";

import { useToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

export interface EmptyStateProps {
  /** Title displayed prominently */
  title: string;
  /** Description text */
  description?: string;
  /** Optional image URL */
  image?: string;
  /** Optional URL to redirect to */
  link?: string;
  /** Optional URL text */
  linkText?: string;
  /** Optional button text */
  buttonText?: string;
  /** Optional button onClick handler */
  onButtonClick?: () => void;
}

export default function EmptyState({
  title,
  description = "Something went wrong. Please try again.",
  image,
  link,
  linkText,
  buttonText = "Try Again",
  onButtonClick,
}: EmptyStateProps) {
  const pushToast = useToast();

  return (
    <Card className="max-w-xl mx-auto my-12 p-6 border border-dashed border-brand-orange/50 rounded-xl text-center">
      {image && (
        <div className="flex justify-center mb-6">
          <img 
            src={image} 
            alt={title} 
            className="w-32 h-32 rounded-full"
          />
        </div>
      )}
      
      <h1 className="text-4xl font-bold text-brand-navy mb-4">
        {title}
      </h1>
      
      {description && (
        <p className="text-lg text-gray-700 mb-6">
          {description}
        </p>
      )}
      
      {link && (
        <div className="flex items-center justify-center mb-6">
          <a 
            href={link} 
            className="inline-flex items-center gap-2 text-brand-orange font-medium hover:underline"
          >
            {linkText ?? "View Details"}
            <ArrowRight className="size-4" />
          </a>
        </div>
      )}
      
      <Button
        onClick={onButtonClick}
        className="w-full py-3 bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold"
      >
        {buttonText}
      </Button>
    </Card>
  );
}