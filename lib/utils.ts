import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CartItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-GA', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(price: number, originalPrice: number | null): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function generateWhatsAppMessage(
  items: CartItem[],
  customer: { name: string; phone: string; city: string; neighborhood: string },
  total: number
): string {
  let message = '🛒 *NOUVELLE COMMANDE*\n\n';
  if (customer.name) message += `👤 *Client:* ${customer.name}\n`;
  if (customer.phone) message += `📱 *Tél:* ${customer.phone}\n`;
  if (customer.city) message += `🏙️ *Ville:* ${customer.city}\n`;
  if (customer.neighborhood) message += `📍 *Quartier:* ${customer.neighborhood}\n`;
  message += '\n*─────────────────────*\n📦 *ARTICLES*\n*─────────────────────*\n\n';
  items.forEach((item, idx) => {
    message += `${idx + 1}. ${item.product_name}\n`;
    if (item.size) message += `   Taille: ${item.size}\n`;
    message += `   Quantité: ${item.quantity}\n   Prix: ${formatPrice(item.unit_price * item.quantity)}\n\n`;
  });
  message += '*─────────────────────*\n' + `💰 *TOTAL: ${formatPrice(total)}*\n` + '*─────────────────────*\n\n' + '✅ Veuillez confirmer cette commande.\nNous vous recontacterons rapidement!';
  return encodeURIComponent(message);
}

export function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}