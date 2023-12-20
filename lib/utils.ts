import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyDecimals = 9;

export const projectUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://fuel-burner-wallet.vercel.app'
    : 'http://localhost:3000';
