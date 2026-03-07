"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MAX_ATTEMPTS, LOCKOUT_DURATION_MS } from "@/constants/auth";

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const failedAttemptsRef = useRef(0);

  useEffect(() => {
    if (!lockoutEndTime) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((lockoutEndTime - Date.now()) / 1000),
      );
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setLockoutEndTime(null);
        setFailedAttempts(0);
        failedAttemptsRef.current = 0;
        setError(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  const isLockedOut = !!lockoutEndTime && Date.now() < lockoutEndTime;

  const handleFailedAttempt = useCallback(() => {
    const newCount = failedAttemptsRef.current + 1;
    failedAttemptsRef.current = newCount;
    setFailedAttempts(newCount);

    if (newCount >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_DURATION_MS;
      setLockoutEndTime(until);
      setError(
        `Too many failed attempts. Try again in ${Math.ceil(LOCKOUT_DURATION_MS / 1000)} seconds.`,
      );
    }
  }, []);

  const attemptLogin = useCallback(
    async (
      username: string,
      password: string,
      bookingCode?: string,
    ): Promise<boolean> => {
      if (isLockedOut) {
        setError(`Too many failed attempts. Try again in ${timeLeft} seconds.`);
        return false;
      }

      setError(null);
      setIsLoading(true);

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, bookingCode }),
        });

        if (res.ok) {
          failedAttemptsRef.current = 0;
          setFailedAttempts(0);
          setLockoutEndTime(null);
          return true;
        }

        if (res.status >= 500) {
          setError("Temporary server issue. Please try again shortly.");
          handleFailedAttempt();
          return false;
        }

        const body = await res.json().catch(() => ({}));
        const reason = body?.reason;

        if (
          reason === "missing_credentials" ||
          reason === "invalid_request_body"
        ) {
          setError("Please enter both a username and password.");
        } else {
          setError("Invalid username or password.");
        }

        handleFailedAttempt();
        return false;
      } catch {
        setError("Network error. Please check your connection.");
        handleFailedAttempt();
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isLockedOut, timeLeft, handleFailedAttempt],
  );

  return {
    attemptLogin,
    error,
    isLockedOut,
    isLoading,
    timeLeft,
    failedAttempts,
  };
}
