import React from "react";

export interface BentoItem {
  id: string;
  content: React.ReactNode;
  className?: string;
  url?: string;
  type: string;
  starred?: boolean;
  tags?: string[];
  tagVisible?: boolean; // If false, tags are hidden from the UI/filter
  showTags?: boolean; // If false, tags are hidden on the card UI
  scale?: number; // Card scale (e.g., 2 for YouTube)
  private?: boolean; // Card is private/locked
  title?: string;
  color?: string;
  comment?: string;
}