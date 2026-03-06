'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { FormField } from '@/components/molecules/FormField/FormField';
import { Button } from '@/components/atoms/Button/Button';
import styles from './LoginForm.module.scss';

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  const { attemptLogin, error, isLockedOut, timeLeft, isLoading } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await attemptLogin(username.trim(), password, bookingCode || undefined);
    if (success) onSuccess();
  };



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign In</h1>
      <p className={styles.subtitle}>Enter your credentials</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={setUsername}
          disabled={isLockedOut || isLoading}
          placeholder="e.g. kminchelle"
          required
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          disabled={isLockedOut || isLoading}
          placeholder="••••••••"
          required
        />

        <FormField
          id="bookingCode"
          label="Booking Code"
          type="text"
          value={bookingCode}
          onChange={setBookingCode}
          disabled={isLockedOut || isLoading}
          placeholder="e.g. ABC123"
          optional
        />

        {error && (
          <div className={`${styles.error} ${isLockedOut ? styles.warning : ''}`}>
            {error}
            {isLockedOut && timeLeft > 0 && (
              <div className={styles.lockoutTimer}>
                Remaining: {timeLeft}s
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          loadingText='Logging in'
          disabled={isLockedOut || isLoading || !username.trim() || !password}
        >
          Login
        </Button>
      </form>
    </div>
  );
}