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
  rotation?: number; // Card rotation in degrees
  x?: number; // Card x position (px)
  y?: number; // Card y position (px)
  width?: number; // Card width (px)
  height?: number; // Card height (px)
}

export interface FABItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
}