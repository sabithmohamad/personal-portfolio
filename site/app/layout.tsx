import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Mohammad Sabith | Software Engineer',
  description:
    'A chat-first portfolio for Mohammad Sabith, a software engineer with 3+ years of production experience specializing in React, TypeScript, performance, and product-minded systems.',
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
