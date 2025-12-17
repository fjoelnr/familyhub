"use client";

import React from 'react';
import { FamilyHubProvider } from '@/lib/contexts/FamilyHubContext';
import { HubShell } from '@/components/shell/HubShell';

export default function Home() {
  return (
    <FamilyHubProvider>
      <HubShell />
    </FamilyHubProvider>
  );
}
