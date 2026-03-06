'use client';

import { LoginForm } from '@/components/organisms/LoginForm/LogInForm';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <LoginForm onSuccess={() => router.push('/destinations')} />
    </div>
  );
}