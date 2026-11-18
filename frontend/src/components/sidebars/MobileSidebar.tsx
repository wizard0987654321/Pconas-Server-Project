/* ==========================================================================
 * BOOK THREAD 0.6.4  MobileSidebar   (Chapter 0: App start and layout)
 * File: src/components/sidebars/MobileSidebar.tsx
 *
 * Sidebar for small screens, opened with the menu button. Shows the same NavList (0.6.3.1).
 *
 * Used by: 0.6 Navigation
 * Uses: 0.6.3.1 NavList
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import NavList from "../navComponents/NavList"; // 0.6.3.1 NavList

type Props = {
    open: boolean;
    onClose: () => void;
};

function MobileSidebar({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="absolute inset-0 z-50 sm:hidden">

            {/* Sidebar */}
            <div className="relative w-full bg-[#F8FAFC] dark:bg-[#0F234F] border-b-4 border-[#6ADBAF] dark:border-[#6ADBAF] shadow-md">
                <div className="flex justify-start px-4">
                    <button onClick={onClose} className="text-2xl">
                        ✕
                    </button>
                </div>

                <nav className="flex flex-col items-center gap-2 pb-4">
                    <NavList /* 0.6.3.1 */ onItemClick={onClose} />
                </nav>
            </div>
        </div>
    );
}

export default MobileSidebar;

// → Next in the book: 0.7 ErrorPage  (src/pages/ErrorPage.tsx)
