import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://misbah.site'),
};

export default function FindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
