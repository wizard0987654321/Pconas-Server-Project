/* ==========================================================================
 * BOOK THREAD 2.5.15  PowerLegend   (Chapter 2: Rooms)
 * File: src/components/powerSimulation/PowerLegend.tsx
 *
 * Small legend explaining the colors (powered / no power / dead cable).
 *
 * Used by: 2.5 DetailedRoom
 * Uses: 2.5.7 powerStyles
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { LEGEND_STATES, POWER_STATE_DOT_CLASS, powerStateKey } from "./powerStyles"; // 2.5.7 powerStyles

interface PowerLegendProps {
    t: (key: string) => string;
}

// Explains the icon colors and dashed cables
function PowerLegend({ t }: PowerLegendProps) {
    return (
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {LEGEND_STATES.map(state => (
                <li key={state} className="flex items-center gap-2">
                    <span className={`inline-block h-3 w-3 rounded-full ${POWER_STATE_DOT_CLASS[state]}`} />
                    {t(powerStateKey(state))}
                </li>
            ))}

            <li className="flex items-center gap-2">
                <svg width="28" height="6" aria-hidden="true">
                    <line x1="2" y1="3" x2="26" y2="3" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
                </svg>
                {t("pages.rooms.detailedView.power.deadCable")}
            </li>
        </ul>
    );
}

export default PowerLegend;

// → Next in the book: 2.5.16 ConnectionHoverCard  (src/components/hoverCards/ConnectionHoverCard.tsx)
