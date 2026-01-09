"use client";
import React from 'react';

import OrientationHeader from "@/components/zones/OrientationHeader";
import NavigationRail from "@/components/shell/NavigationRail";
import FluidStage from "@/components/zones/FluidStage";
import InputDeck from "@/components/zones/InputDeck";

import { useEffect } from "react";
import { useFamilyHub } from "@/lib/contexts/FamilyHubContext";

export default function HubShell() {
    const { context } = useFamilyHub();

    useEffect(() => {
        document.body.dataset.fsMode = context.uiMode;
    }, [context.uiMode]);

    return (
        <div className="flex flex-col h-screen overflow-hidden transition-colors duration-500 bg-[var(--background-dark)]">
            {/* Zone A: Top Orientation Header */}
            <div className="flex-none z-50">
                <OrientationHeader />
            </div>

            {/* Main Layout Row */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Navigation Rail */}
                <aside className="w-[80px] md:w-[100px] flex-none z-40 bg-[var(--surface-dark)] border-r border-[var(--border)]">
                    <NavigationRail />
                </aside>

                {/* Right Content Area: FluidStage + Input */}
                <main className="flex flex-col flex-1 relative min-w-0">

                    {/* Zone B: Fluid Stage (takes available space) */}
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <FluidStage />
                    </div>

                    {/* Zone C: Input Deck (bottom anchor) */}
                    <div className="flex-none z-30 pb-4 px-4 md:px-8">
                        <InputDeck />
                    </div>

                </main>
            </div>
        </div>
    );
}