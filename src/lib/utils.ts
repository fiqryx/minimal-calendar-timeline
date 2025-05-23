import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Phoenix', 'Orion', 'Quantum', 'Nova'];
const suffixes = ['Launch', 'Horizon', 'Dynamo', 'Pulse', 'Vortex', 'Matrix', 'Genesis'];

export function generateRandom(count = 4) {
  const data = [];
  const currentDate = new Date();

  for (let i = 1; i <= count; i++) {
    const name = [
      prefixes[Math.floor(Math.random() * prefixes.length)],
      suffixes[Math.floor(Math.random() * suffixes.length)],
    ].join(' ');

    const createdAt = new Date(currentDate);
    createdAt.setDate(currentDate.getDate() - Math.floor(Math.random() * 60) - 1);

    const startDate = new Date(createdAt);
    startDate.setDate(createdAt.getDate() + Math.floor(Math.random() * 60));

    // 20% chance of having no dates
    const hasDates = Math.random() > 0.2;

    let endDate;
    if (hasDates) {
      const duration = Math.floor(Math.random() * 100) + 1;
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration);
    }

    data.push({
      id: i,
      name,
      createdAt,
      ...(hasDates && { startDate, endDate })
    });
  }

  return data;
}

export function sortByDate<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    if (!a[field] && !b[field]) return 0;
    if (!a[field]) return 1;
    if (!b[field]) return -1;

    try {
      const dateA = new Date(a[field]).getTime();
      const dateB = new Date(b[field]).getTime();

      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;

      return order === 'desc' ? dateB - dateA : dateA - dateB;
    } catch {
      return 0;
    }
  });
};