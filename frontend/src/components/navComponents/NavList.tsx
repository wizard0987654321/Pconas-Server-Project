/* ==========================================================================
 * BOOK THREAD 0.6.3.1  NavList   (Chapter 0: App start and layout)
 * File: src/components/navComponents/NavList.tsx
 *
 * The list of page links (Home, Rooms, Racks, ...). Shared by both sidebars. These links lead to chapters 1 -
 * 8.
 *
 * Used by: 0.6.3 DesktopSidebar, 0.6.4 MobileSidebar
 * Uses: 0.6.3.1.1 NavItem, 0.6.3.1.2 NavItemSeparation
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import NavItem from "./NavItem"; // 0.6.3.1.1 NavItem
import NavItemSeparation from "./NavItemSeparation"; // 0.6.3.1.2 NavItemSeparation

type Props = {
    onItemClick?: () => void;
};


//common NavList data component for mobile and desktop sidebars
function NavList({ onItemClick }: Props) {
    return (
        <>
            <NavItem /* 0.6.3.1.1 */ to="/" label="nav.home" onClick={onItemClick}/>
            <NavItemSeparation /* 0.6.3.1.2 */ />
            <NavItem /* 0.6.3.1.1 */ to="rooms" label="nav.rooms" onClick={onItemClick}/>
            <NavItemSeparation /* 0.6.3.1.2 */ />
            <NavItem /* 0.6.3.1.1 */ to="racks" label="nav.racks" onClick={onItemClick}/>
            <NavItemSeparation /* 0.6.3.1.2 */ />
            <NavItem /* 0.6.3.1.1 */ to="deviceTypes" label="nav.deviceTypes" onClick={onItemClick}/>
            <NavItemSeparation /* 0.6.3.1.2 */ />
            <NavItem /* 0.6.3.1.1 */ to="devices" label="nav.devices" onClick={onItemClick}/>
            <NavItemSeparation /* 0.6.3.1.2 */ />
            <NavItem /* 0.6.3.1.1 */ to="vms" label="nav.vms" onClick={onItemClick}/>
            <NavItemSeparation /* 0.6.3.1.2 */ />
            <NavItem /* 0.6.3.1.1 */ to="services" label="nav.services" onClick={onItemClick}/>
            <NavItemSeparation /* 0.6.3.1.2 */ />
            <NavItem /* 0.6.3.1.1 */ to="customers" label="nav.customers" onClick={onItemClick}/>
        </>
    );
}

export default NavList;

// → Next in the book: 0.6.3.1.1 NavItem  (src/components/navComponents/NavItem.tsx)
