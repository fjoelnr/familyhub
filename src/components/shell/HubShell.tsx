import React from 'react';
import { AmbientCanvas } from '../zones/AmbientCanvas';
import { StatusRail } from '../zones/StatusRail';
import { FluidStage } from '../zones/FluidStage';
import { InputDeck } from '../zones/InputDeck';

export const HubShell: React.FC = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden flex flex-col">
            {/* Zone A: Background (Layer 0) */}
            <AmbientCanvas />

            {/* Foreground Content (Layer 1) */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Zone B: Top Persistent Rail */}
                <StatusRail />

                {/* Zone C: Main Stage (Flexible) */}
                <FluidStage />

                {/* Zone D: Bottom Input (Fixed) */}
                <InputDeck />
            </div>
        </div>
    );
};
