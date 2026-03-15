import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Mohammad Sabith | Frontend Engineer',
  description:
    'A chat-first portfolio for Mohammad Sabith, a frontend engineer focused on React, TypeScript, performance, and product-minded UI.',
  icons: {
    icon: [{ url: '/favicon.svg?v=4', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg?v=4',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-shell text-ink antialiased">{children}</body>
    </html>
  );
}
