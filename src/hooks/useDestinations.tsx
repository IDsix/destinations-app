import { useCallback, useEffect, useState } from 'react';
import type { Destination } from '@/types/destinations';

export function useDestinations(autoFetch = true) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/destinations');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: Destination[] = await res.json();
      setDestinations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchDestinations();
  }, [autoFetch, fetchDestinations]);

  return { destinations, loading, error, refetch: fetchDestinations };
}