/* ==========================================================================
 * BOOK THREAD 0.6.3.1.1  NavItem   (Chapter 0: App start and layout)
 * File: src/components/navComponents/NavItem.tsx
 *
 * One link in the sidebar.
 *
 * Used by: 0.6.3.1 NavList
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

type NavItemProps = {
    to: string,
    label: string,
    onClick?: () => void
}

function NavItem (
    { to, label, onClick }: NavItemProps
) {
    const { t } = useTranslation();

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `py-4 font-mono text-sm m:text-lg transition-colors hover:text-[#6ADBAF] ${
                    isActive ? "font-bold text-[#6ADBAF]" : "text-[#111827] dark:text-[#F9FAFB]"
                }`
            }
        >
            {t(label)}
        </NavLink>
    );
}

export default NavItem;

// → Next in the book: 0.6.3.1.2 NavItemSeparation  (src/components/navComponents/NavItemSeparation.tsx)
