export type Destination = {
    name: string;
    slug?: string;
    code: string;
    thumbnail: string;
    countHotels: number;
    countDestinations: number;
    destinations?: SubDestination[];
  };

  export type SubDestination = {
    name: string;
    slug: string;
    code: string;
    thumbnail: string;
    countHotels: number;
    alias?: string[];
  };