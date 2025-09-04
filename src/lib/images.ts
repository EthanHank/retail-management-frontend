import type { Product } from "@/api/products/types";
import type { User } from "@/api/users/types";

export function createPlaceholderImage(text?: string, size: number = 300, id?: string | number): string {
  // Use ?? to avoid "undefined.slice" errors
  const initials = text ? text.slice(0, 2).toUpperCase() : "??";

  // Colors for variety
  const colors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ];

  // If id is string, convert to number hash
  let colorIndex = 0;
  if (id !== undefined) {
    if (typeof id === "number") {
      colorIndex = id % colors.length;
    } else {
      // simple hash from string id
      colorIndex = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    }
  }

  const color = colors[colorIndex];
  const fontSize = Math.floor(size * 0.24);

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${color}"/>
      <text x="${size / 2}" y="${size / 2}" font-family="system-ui" font-size="${fontSize}" font-weight="bold"
            text-anchor="middle" dominant-baseline="central" fill="white">
        ${initials}
      </text>
    </svg>
  `)}`;
}

export function getProductImage(product: Product & { thumbnail?: string }): string {
  if (product.thumbnail && product.thumbnail.trim()) {
    return product.thumbnail;
  }

  return createPlaceholderImage(product.productName, 300, product.id);
}

export function getUserImage(user: User & { thumbnail?: string }): string {
  if (user.thumbnail && user.thumbnail.trim()) {
    return user.thumbnail;
  }

  return createPlaceholderImage(user.username, 300, user.id);
}

export function getUserAvatar(name: string = 'User', size: number = 32): string {
  return createPlaceholderImage(name, size);
}
