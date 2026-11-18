/* ==========================================================================
 * BOOK THREAD 2.5.7  powerStyles   (Chapter 2: Rooms)
 * File: src/components/powerSimulation/powerStyles.ts
 *
 * Colors and text keys per power state, used by all power simulation components.
 *
 * STYLE CONSTANTS - only class names / colors, renders no HTML.
 *
 * Used by: 2.5 DetailedRoom, 2.5.8 PowerSource, 2.5.8.1 PowerStatusText, 2.5.8.3 DamagedMark,
 *   2.5.15 PowerLegend, 2.6 DetailedRack
 * Uses: 2.5.2.1 powerFlow
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import type { PowerState } from "../../helpers/powerFlow"; // 2.5.2.1 powerFlow

// One place for how each power state looks, used by icons, hover overlays and the legend.
// Full class names (no string building), so Tailwind finds them.

// Extra classes for equipment icons, only "no power" is visible on the icon itself
// (battery is still shown as text in the hover overlays)
export const POWER_STATE_ICON_CLASS: Record<PowerState, string> = {
    powered: "",
    battery: "",
    unpowered: "grayscale opacity-40",
};

// Text color of the status in hover overlays
export const POWER_STATE_TEXT_CLASS: Record<PowerState, string> = {
    powered: "text-[#16A34A] dark:text-[#6ADBAF]",
    battery: "text-[#D97706] dark:text-[#F59E0B]",
    unpowered: "text-[#DC2626] dark:text-[#F87171]",
};

// States that look different on the icons, so the legend explains only these
export const LEGEND_STATES = ["powered", "unpowered"] as const;

// Small colored dot (legend)
export const POWER_STATE_DOT_CLASS: Record<(typeof LEGEND_STATES)[number], string> = {
    powered: "bg-[#6ADBAF]",
    unpowered: "bg-gray-400",
};

// Color of damaged cables and of the red X on damaged equipment
export const DAMAGED_COLOR = "#DC2626";

export const powerStateKey = (state: PowerState) => `pages.rooms.detailedView.power.states.${state}`;

// → Next in the book: 2.5.8 PowerSource  (src/components/powerSimulation/PowerSource.tsx)
