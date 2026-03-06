// app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/globals.scss';   


export const metadata: Metadata = {
  title: 'Travel Destinations',
  description: 'Explore destinations after login',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}