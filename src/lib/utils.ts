import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add a helper to safely build absolute image URLs from possibly relative paths
export function buildImageUrl(input?: string): string | undefined {
  if (!input) return undefined;

  try {
    // If already a valid absolute URL, return as-is
    const url = new URL(input);
    return url.toString();
  } catch {
    // Not a valid absolute URL; try to normalize common relative cases
    const trimmed = input.trim();
    if (!trimmed) return undefined;

    // Handle leading slashes or no leading slash for API-hosted assets
    const base = "https://api.roomfinder237.com/";
    const normalized = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
    return base + normalized;
  }
}
