export interface HowItWorksStep {
  title: string;
  description: string;
}

/** Rendered in order — the "Step N" label comes from the array index. */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: "Find a Service",
    description: "Browse verified repair services by category and area.",
  },
  {
    title: "Send a Request",
    description: "Share the problem, your address and a preferred date.",
  },
  {
    title: "Technician Fixes It",
    description: "A verified technician accepts the job and repairs your device.",
  },
  {
    title: "Pay After Completion",
    description: "Track progress and pay securely only once the job is done.",
  },
];
