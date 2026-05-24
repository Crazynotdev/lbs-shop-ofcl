import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CartItem } from '@/types';

// ————————————————————————————————————————————
// Classnames merger
// ————————————————————————————————————————————

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ————————————————————————————————————————————
// Formatage prix FCFA
// ————————————————————————————————————————————

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('XAF', 'FCFA');
}

export function formatPriceRaw(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// ————————————————————————————————————————————
// Calcul remise
// ————————————————————————————————————————————

export function calculateDiscount(price: number, originalPrice: number | null): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ————————————————————————————————————————————
// Slug generator
// ————————————————————————————————————————————

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ————————————————————————————————————————————
// Génération numéro commande
// ————————————————————————————————————————————

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `LBS-${timestamp}-${random}`;
}

// ————————————————————————————————————————————
// Génération message WhatsApp
// ————————————————————————————————————————————

export function generateWhatsAppMessage(
  items: CartItem[],
  customerInfo: {
    name: string;
    phone: string;
    city: string;
    neighborhood: string;
    address?: string;
  },
  total: number
): string {
  const itemsList = items
    .map((item) => {
      const lines = [
        `• ${item.product_name}`,
        item.size ? `  Taille : ${item.size}` : null,
        `  Quantité : ${item.quantity}`,
        `  Prix : ${formatPriceRaw(item.unit_price)}`,
      ]
        .filter(Boolean)
        .join('\n');
      return lines;
    })
    .join('\n\n');

  const message = `Bonjour LBS Shop 👋,

Je souhaite commander :

${itemsList}

💰 *Montant total : ${formatPriceRaw(total)}*

__________________
📋 *Informations client :*

Nom : ${customerInfo.name}
Téléphone : ${customerInfo.phone}
Ville : ${customerInfo.city}
Quartier : ${customerInfo.neighborhood}${
    customerInfo.address ? `\nAdresse : ${customerInfo.address}` : ''
  }

Merci ! 🙏`;

  return encodeURIComponent(message);
}

// ————————————————————————————————————————————
// Supabase Storage URL
// ————————————————————————————————————————————

export function getStorageUrl(bucket: string, path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

// ————————————————————————————————————————————
// Truncate text
// ————————————————————————————————————————————

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

// ————————————————————————————————————————————
// Session ID pour analytics
// ————————————————————————————————————————————

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('lbs_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('lbs_session_id', id);
  }
  return id;
}

// ————————————————————————————————————————————
// Format date
// ————————————————————————————————————————————

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

// ————————————————————————————————————————————
// Primary image helper
// ————————————————————————————————————————————

export function getPrimaryImage(images?: { url: string; is_primary: boolean }[]): string | null {
  if (!images || images.length === 0) return null;
  const primary = images.find((img) => img.is_primary);
  return primary?.url ?? images[0]?.url ?? null;
}

// ————————————————————————————————————————————
// Debounce
// ————————————————————————————————————————————

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}
