# FamilyHub UI System Concept

## Executive Summary
**"Calm Intelligence"**
The FamilyHub UI is not a productivity tool; it is a member of the household. It breathes with the home's rhythm. Most of the time, it is an ambient canvas (digital art / clock); when approached or spoken to, it gracefully wakes up to become a helpful agent. It does not bombard the user with notifications. It waits to be useful.

---

## 1. Information Hierarchy

We group information into three distinct "Distance Layers" based on how far away the user is (physically or mentally).

### Level 1: The Glance (3+ meters)
*Visible from across the room. Minimal cognitive load.*
*   **Time of Day**: Analog (Calm) or Digital (Nerdy).
*   **Essential Context**: "School Day", "Holiday".
*   **Primary Status**: Weather icon, or a single "Next Event" if imminent.
*   **Ambient Mood**: Background color/animation reflecting time/season.

### Level 2: The Approach (1 meter)
*Visible when standing in front of the screen. Readable without touching.*
*   **Recent Agent Activity**: Last answer or confirmed action (e.g., "Gym added to calendar").
*   **Daily Briefing**: 3-4 key items for the day.
*   **Notifications**: Only high-priority alerts (e.g., "Mom is calling").

### Level 3: The Interaction (Touch)
*Visible only during active use.*
*   **Input Field**: Chat / Command entry.
*   **Detailed Views**: Full calendar grid, weather graphs, explanation text.
*   **Confirmation Dialogs**: "Confirm deletion of event?"

---

## 2. UI Zones / Regions

The interface is divided into **four stable regions**. These regions persist across all modes but change their visual density.

### A. Ambient Canvas (Z-Index 0)
*   **Role**: The background. Sets the emotional tone.
*   **Behavior**: Slowly shifting gradients (Calm), Grid lines/Data streams (Nerdy), or Scene/Character info (Manga).
*   **Reacts to**: Time of Day, Region (Holiday), Weather.

### B. The Status Rail (Top or Left Edge)
*   **Role**: The "Dashboard". Always visible context.
*   **Content**: Clock, Weather Widget, Context Badges (Work/School mode).
*   **Interaction**: Tap to force-refresh data or toggle simple states.

### C. The Fluid Stage (Center / Main)
*   **Role**: The Agent's playground. The "content".
*   **Content**: By default, it shows the **"Passive Dashboard"** (Next Events). When an Agent is active, it transforms into the **"Active Conversation"** view (Chat bubbles, Action Cards).
*   **Behavior**: Transitions must be slow and fade-in. No jarring layout shifts.

### D. The Input Deck (Bottom)
*   **Role**: User control.
*   **Content**: Microphone icon (Voice), Text Input (Keyboard), Quick Action chips ("What's for dinner?", "Add appointment").

---

## 3. UI Behavior Rules

The UI is a state machine driven by `AgentResponse` and `ContextSnapshot`.

### Response Handling
| Agent Response Type | UI Behavior |
| :--- | :--- |
| **`chat`** | Appears as a new block in the *Fluid Stage*. Old blocks fade slightly. |
| **`action_request` (Confirmation)** | **Interrupting Card**. The *Fluid Stage* clears or dims. A distinct "Proposal Card" appears with "Verify" and "Cancel" buttons. Cannot be ignored. |
| **`clarification_needed`** | Appears as a Chat Bubble ending with a ? prompt. The *Input Deck* automatically focuses. |
| **`error`** | Gentle toaster in the *Status Rail*. Does not block the screen unless critical. |

### Context Reactivity
*   **Morning (6-9 AM)**: *Status Rail* highlights Calendar & Weather. High contrast for waking up.
*   **Evening (8-11 PM)**: *Ambient Canvas* dims. Blue light reduced. Text size increases slightly.
*   **School Day**: *Status Rail* shows "School Mode" badge. Education-related widgets promoted.

---

## 4. UI Mode Differences

The `uiMode` context drastically changes the *rendering* of the components, but not the *logic*.

### 🌿 Calm Mode (Default)
*   **Philosophy**: "Digital Furniture".
*   **Aesthetics**: Serif fonts, soft pastels, rounded corners, natural gradients.
*   **Data Density**: Low. Hides metadata. "2:00 PM" instead of "2023-12-17 14:00:00".
*   **Motion**: Slow fades (1s transition).

### 🤓 Nerdy Mode
*   **Philosophy**: "Mission Control".
*   **Aesthetics**: Monospace fonts, high contrast (black/green/amber), sharp corners, borders.
*   **Data Density**: High. Shows API latency, full timestamps, confidence scores of intents.
*   **Motion**: Instant snaps or computer console typing effects.

### 🌸 Manga Mode
*   **Philosophy**: "Future Friend".
*   **Aesthetics**: Bold outlines, vibrant colors, comic-book speech bubbles.
*   **Extras**: An Avatar (sprite) represents the Agent in the *Fluid Stage*. Emotions map to Agent sentiment.
*   **Motion**: Bouncy, spring physics.

---

## 5. Component Structure (React)

```tsx
<FamilyHubRoot>
  {/* Data Layer */}
  <ContextProvider>
    <AgentRuntime> {/* Handles Intent -> Router -> Action */}
      
      {/* Visual Layer */}
      <LayoutShell>
      
        {/* Layer 1: Background */}
        <AmbientCanvas /> 
          {/* Renders <CalmGradient /> or <MatrixRain /> or <AnimeScenery /> */}

        {/* Layer 2: Persistent UI */}
        <StatusRail>
           <ClockWidget />
           <WeatherWidget />
           <ContextBadges />
        </StatusRail>

        {/* Layer 3: Main Content */}
        <FluidStage>
           {/* Conditional Rendering based on Interaction State */}
           {isIdle ? (
              <DashboardView>
                 <CalendarWidget variant="list" />
                 <NotesWidget />
              </DashboardView>
           ) : (
              <ConversationStream>
                 {messages.map(msg => (
                    <AgentMessageBubble type={msg.type} content={msg.content} />
                    /* Or <ActionConfirmationCard /> */
                 ))}
              </ConversationStream>
           )}
        </FluidStage>

        {/* Layer 4: Interaction */}
        <InputDeck />

      </LayoutShell>
    </AgentRuntime>
  </ContextProvider>
</FamilyHubRoot>
```

### Key Component Responsibilities
*   **`AmbientCanvas`**: Purely decorative. Listens to `uiMode` and `time`. Zero interactivity.
*   **`FluidStage`**: The smart layout manager. Decides if we are in "Dashboard Mode" (viewing widgets) or "Chat Mode" (viewing agent thread).
*   **`AgentMessageBubble`**: A polymorphic component.
    *   If `uiMode === 'calm'`, renders a simple text block.
    *   If `uiMode === 'manga'`, renders a speech bubble next to an avatar.
