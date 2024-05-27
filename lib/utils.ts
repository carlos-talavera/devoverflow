import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  const units: [number, string][] = [
    [60, "second"], // 60 seconds in a minute
    [60, "minute"], // 60 minutes in an hour
    [24, "hour"], // 24 hours in a day
    [30, "day"], // ~30 days in a month
    [12, "month"], // 12 months in a year
    [Number.MAX_SAFE_INTEGER, "year"], // years can go indefinitely
  ];

  let elapsed = diffInSeconds;
  for (const [unitSize, unitName] of units) {
    if (elapsed < unitSize) {
      const roundedElapsed = Math.floor(elapsed);
      return `${roundedElapsed} ${unitName}${roundedElapsed !== 1 ? "s" : ""} ago`;
    }
    elapsed /= unitSize;
  }

  return "just now"; // fallback in case of an unexpected error
}

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return num.toString();
  }
};

export const formatDate = (date: Date): string => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()]; // getMonth() returns month from 0-11
    const year = date.getFullYear();
    return `${month} ${year}`;
}