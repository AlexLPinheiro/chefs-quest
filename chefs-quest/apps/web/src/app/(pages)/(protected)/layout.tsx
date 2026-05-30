import type { ReactNode } from "react";
import ProtectedShell from "./_components/protected-shell";
import HeaderWithProgress from "./_components/header-with-progress";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ProtectedShell header={<HeaderWithProgress />}>
      {children}
    </ProtectedShell>
  );
}
