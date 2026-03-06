'use client';

import { useLogout } from '@/hooks/useLogout';
import { Button } from '../../atoms/Button/Button';

export default function LogoutButton() {
  const { logout, isLoading, error } = useLogout();

  return (
    <div>
      <Button
        onClick={logout}
        isLoading={isLoading}
      >
        Logout
      </Button>
      {error && <div role="alert">{error}</div>}
    </div>
  );
}