import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a readable format (e.g., "Sep 11, 2025, 10:30 PM").
 * @param dateString - The ISO date string to format.
 * @returns A formatted date string.
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Returns a Tailwind CSS class string for styling submission status badges.
 * @param status - The status of the submission ('pending' or 'reviewed').
 * @returns A string of CSS classes.
 */
export const getStatusColor = (status: 'pending' | 'reviewed' | string): string => {
  switch (status) {
    case 'reviewed':
      return 'bg-medical-green text-white';
    case 'pending':
      return 'bg-medical-orange text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};