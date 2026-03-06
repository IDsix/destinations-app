import { NextResponse } from 'next/server';
import type { Destination } from '@/types/destinations';

export async function GET() {
  try {
    const res = await fetch(process.env.DESTINATIONS_API_URL!, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: Destination[] = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}