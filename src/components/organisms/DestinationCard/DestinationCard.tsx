"use client";

import type { Destination, SubDestination } from "@/types/destinations";
import styles from "./DestinationCard.module.scss";
import { ChevronIcon } from "@/components/atoms/ChevronIcon/ChevronIcon";

type DestinationCardProps = {
  destination?: Destination;
  isLoading?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
};

export function DestinationCard({
  destination,
  isLoading = false,
  isExpanded = false,
  onToggle,
}: DestinationCardProps) {
  if (isLoading) {
    return (
      <div
        className={`${styles.card} ${styles.skeleton}`}
        aria-busy="true"
        aria-label="Loading destination"
      >
        <div className={styles.thumbnailSkeleton} />
        <div className={styles.content}>
          <div className={styles.lineLong} />
          <div className={styles.lineStats} />
        </div>
      </div>
    );
  }

  const hasSubDestinations = (destination?.destinations?.length ?? 0) > 0;

  return (
    <div
      className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}
      onClick={onToggle}
    >
      <img
        src={destination?.thumbnail}
        alt={destination?.name}
        className={styles.destinationImage}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
        }}
      />

      <div className={styles.content}>
        {!isExpanded && (
          <h1 className={styles.name}>
            {destination?.name} | {destination?.code}
          </h1>
        )}
        {!isExpanded && (
          <p className={styles.stats}>
            {destination?.countHotels} hotels · {destination?.countDestinations}{" "}
            sub-destinations
          </p>
        )}

        {isExpanded && hasSubDestinations && (
          <ul
            className={`${styles.subList} ${
              isExpanded ? styles.subListVisible : ""
            } ${destination!.destinations!.length <= 4 ? styles.reverse : ""}`}
          >
            <li className={styles.subListTitle}>
              {destination?.name} | {destination?.code}
            </li>
            {destination!.destinations!.map((sub: SubDestination) => (
              <li key={sub.code} className={styles.subItem}>
                <img
                  src={sub?.thumbnail}
                  alt={sub.name}
                  className={styles.subThumbnail}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-image.jpg";
                  }}
                />
                <div className={styles.subInfo}>
                  <span className={styles.subName}>{sub.name}</span>
                  <span className={styles.subStats}>
                    {sub.countHotels} hotels · {sub.code}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {hasSubDestinations && (
          <button
            className={`${styles.toggle} ${
              isExpanded ? styles.toggleExpanded : ""
            }`}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Hide destinations" : "Show destinations"}
          >
            <ChevronIcon isUp={!isExpanded} size={30} />
          </button>
        )}
      </div>
    </div>
  );
}
