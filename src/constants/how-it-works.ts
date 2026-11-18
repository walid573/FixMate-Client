export interface HowItWorksStep {
  title: string;
  description: string;
}

/** Rendered in order — the "Step 1/2/3" label comes from the array index. */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: "Find a Service",
    description: "Browse verified repair services by category and area.",
  },
  {
    title: "Book a Technician",
    description: "Pick a date, share the problem and confirm your booking.",
  },
  {
    title: "Get Your Device Repaired",
    description: "Track progress and pay securely once the job is done.",
  },
];
