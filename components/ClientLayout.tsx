"use client";
import { ReactNode } from "react";
import { HydrationFix } from "./HydrationFix";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HydrationFix />
      {children}
    </>
  );
}
