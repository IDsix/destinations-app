"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { DestinationCard } from "@/components/organisms/DestinationCard/DestinationCard";
import LogoutButton from "@/components/molecules/LogoutButton/LogoutButton";
import { FormField } from "@/components/molecules/FormField/FormField";
import { useDestinations } from "@/hooks/useDestinations";
import styles from "./DestinationList.module.scss";
import { SKELETON_COUNT } from '@/constants/destinations';
import { filterDestinations } from '@/utils/filterDestinations';


export default function DestinationList() {
  const { destinations, loading, error, refetch } = useDestinations();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandCard, setExpandCard] = useState<string | null>(null);
  const [bookingCookie, setBookingCookie] = useState<string | null>(null);

  useEffect(() => {
    setBookingCookie(Cookies.get("booking") ?? null);
  }, []);

  const filtered = useMemo(() => filterDestinations(destinations, searchTerm), [destinations, searchTerm]);

  const items = loading ? Array.from({ length: SKELETON_COUNT }) : filtered;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {bookingCookie
              ? "Destinations for " + bookingCookie
              : "Destinations"}
            <div className={styles.mobileLogout}>
              <LogoutButton />
            </div>
          </h1>

          <div className={styles.searchWrapper}>
            <FormField
              id="search"
              label=""
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search destinations"
            />
          </div>

          <div className={styles.desktopLogout}>
            <LogoutButton />
          </div>
        </header>

        {error && (
          <div className={styles.error} role="alert">
            {error}
            <button onClick={refetch} className={styles.retry}>
              Retry
            </button>
          </div>
        )}

        <div className={styles.grid}>
          {loading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, id) => (
              <DestinationCard key={`skeleton-${id}`} isLoading />
            ))
          ) : filtered.length === 0 && !error ? (
            <p className={styles.empty}>
              No destinations found for "{searchTerm}"
            </p>
          ) : (
            filtered.map((destination) => (
              <DestinationCard
                key={destination.code}
                destination={destination}
                isExpanded={expandCard === destination.code}
                onToggle={() =>
                  setExpandCard(
                    expandCard === destination.code ? null : destination.code
                  )
                }
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
