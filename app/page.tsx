// The app uses client-side navigation via AppShell / PageRouter.
// This page intentionally returns null — layout.tsx renders the full shell.
// Opt out of Next.js instant navigation validation for this segment.
export const instant = false;

export default function Page() {
  return null;
}
