import type { PowerState } from "../../helpers/powerFlow";

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
