"use client";

import StatusRail from "@/components/zones/StatusRail";
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
        <div
            className="flex flex-col h-screen transition-colors duration-500"
        >
            <StatusRail />
            <FluidStage />
            <InputDeck />
        </div>
    );
}