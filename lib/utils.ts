import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateTimestampCode = async (): Promise<{
  codeNumber: string;
}> => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const millisecond = Math.floor(now.getMilliseconds() / 10)
    .toString()
    .padStart(2, "0");
  return { codeNumber: `${year}${month}${minute}${millisecond}` };
};
