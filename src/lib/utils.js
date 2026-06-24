import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const formatDate = (dateString, withDay = false) => {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "-";

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (withDay) {
    options.weekday = "long"; 
  }

  return new Intl.DateTimeFormat("id-ID", options).format(date);
};