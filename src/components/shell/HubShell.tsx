"use client";
import React from 'react';
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
            {/* Main Content Area: FluidStage + Input */}
            <main className="flex flex-col flex-1 relative min-w-0">
                {/* Zone B: Fluid Stage */}
                <div className="flex-1 overflow-hidden relative">
                    <FluidStage />
                </div>

                {/* Zone C: Input Deck */}
                <div className="flex-none z-30 pb-4 px-4 md:px-8">
                    <InputDeck />
                </div>
            </main>
        </div>
    );
}
