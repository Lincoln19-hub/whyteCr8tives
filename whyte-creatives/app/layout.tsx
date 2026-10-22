/**
 * Bare root layout.
 *
 * It deliberately renders nothing but <html><body>{children}</body></html>.
 * All the site chrome (fonts, header, footer, JSON-LD, metadata) lives in
 * app/(site)/layout.tsx so the Sanity Studio at /studio does NOT inherit it —
 * a nested layout cannot remove what the root layout renders, and the Studio
 * needs the full viewport to itself.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
