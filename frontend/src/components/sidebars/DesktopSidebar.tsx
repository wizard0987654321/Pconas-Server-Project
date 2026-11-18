/* ==========================================================================
 * BOOK THREAD 0.6.3  DesktopSidebar   (Chapter 0: App start and layout)
 * File: src/components/sidebars/DesktopSidebar.tsx
 *
 * Sidebar with the page links on large screens.
 *
 * Used by: 0.6 Navigation
 * Uses: 0.6.3.1 NavList
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import NavList from "../navComponents/NavList"; // 0.6.3.1 NavList

function DesktopSidebar() {
    return (
        <div
            className="
                        hidden sm:flex
                        flex-col
                        bg-[#F8FAFC] dark:bg-[#0F234F]
                        border-4 border-[#6ADBAF] dark:border-[#6ADBAF]
                        h-[80vh]
                        2xl:h-[60vh]
                        w-[20vw]
                        rounded-r-[0.75rem] rounded-l-none
                        xs:scale-100
                        middle:scale-[2]
                        biggest:scale-[3]
                    "
        >
            <nav className="flex flex-col justify-between items-center w-full h-full">
                <NavList /* 0.6.3.1 */ />
            </nav>
        </div>
    )
}

export default DesktopSidebar;

// → Next in the book: 0.6.3.1 NavList  (src/components/navComponents/NavList.tsx)
