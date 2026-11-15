import { DAMAGED_COLOR } from "./powerStyles";

// Big red X drawn over the icon of damaged equipment.
// The parent must be `relative`, clicks and hover pass through the X.
function DamagedMark() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
        >
            <path d="M4 4 L20 20 M20 4 L4 20" stroke={DAMAGED_COLOR} strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

export default DamagedMark;
