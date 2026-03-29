import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * تنسيق المبلغ بعملة الـ tenant
 */
export function formatMoney(
    amount: number,
    currency: { symbol: string; decimal_places: number } = { symbol: 'ر.س', decimal_places: 2 }
): string {
    return `${currency.symbol} ${Number(amount).toLocaleString('ar', {
        minimumFractionDigits: currency.decimal_places,
        maximumFractionDigits: currency.decimal_places,
    })}`;
}
