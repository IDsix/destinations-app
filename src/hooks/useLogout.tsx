'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) {
        setError('Failed to log out. Please try again.');
        return false;
      }
      router.push('/');
      return true;
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
}