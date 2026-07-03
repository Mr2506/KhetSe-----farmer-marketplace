"use client";

export function Providers({ children }: { children: React.ReactNode }) {
  // We removed the next-auth SessionProvider! 
  // This will instantly stop all those annoying 404 console errors.
  return <>{children}</>;
}