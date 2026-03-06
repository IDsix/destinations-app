import type { Destination } from '@/types/destinations';

export function filterDestinations(destinations: Destination[], searchTerm: string): Destination[] {
  if (!searchTerm) return destinations;
  const term = searchTerm.toLocaleLowerCase();
  return destinations.filter((destination) =>
    destination.name.toLocaleLowerCase().includes(term) ||
    destination.destinations?.some((sub) =>
      sub.name.toLocaleLowerCase().includes(term) ||
      sub.alias?.some((alias:string) => alias.toLocaleLowerCase().includes(term))
    )
  );
  
}