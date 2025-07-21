import React from "react";

interface FABItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    type: BentoItem['type'];
}

export interface BentoItem {
  id: string;
  content: React.ReactNode;
  className?: string;
  url?: string;
  type: string;
  starred?: boolean;
  tags?: string[];
}