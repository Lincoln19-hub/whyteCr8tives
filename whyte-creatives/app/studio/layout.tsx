/**
 * The Studio gets the whole viewport: no site header, no site footer, no site
 * fonts, no site metadata. The bare root layout (app/layout.tsx) is all that
 * wraps this segment.
 */
export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
