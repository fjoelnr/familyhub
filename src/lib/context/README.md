# Context Module

The context module provides a centralized "snapshot" of the current environment state for the Family Hub. It is used by UI widgets to adapt their display (e.g., "Calm Mode" at night) and by AI agents to understand the temporal and regional context of their prompts.

## Key Features

- **Time Awareness**: Calculates Day Phase (Morning, Afternoon, Evening, Night).
- **Regional Awareness**: Hardcoded support for Bavaria (DE-BY) holidays, including dynamic Easter-based holidays.
- **School Schedule**: Defines school holidays (mocked ranges for 2025/2026).
- **UI Modes**: Suggests a UI theme (`calm`, `nerdy`, `manga`) based on time and day type.

## Usage

```typescript
import { getContextSnapshot } from "@/lib/context/getContextSnapshot";


// Get current context
const ctx = getContextSnapshot();

console.log(ctx.dayPhase); // e.g. "morning"
console.log(ctx.uiMode);   // e.g. "nerdy"

// Get context for a specific date (Server Side / Testing)
const futureCtx = getContextSnapshot({ date: new Date("2025-12-24T10:00:00") });
console.log(futureCtx.regionalHoliday); // "Heiligabend" (if configured) or "Weihnachtsfeiertag" logic
```

## Configuration

Currently, holidays are hardcoded in `getContextSnapshot.ts`.
- **Fixed Holidays**: Standard Bavarian public holidays.
- **School Holidays**: Manual ranges in `SCHOOL_HOLIDAYS` array.
