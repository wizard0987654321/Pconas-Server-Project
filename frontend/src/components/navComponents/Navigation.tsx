/* ==========================================================================
 * BOOK THREAD 0.6  Navigation   (Chapter 0: App start and layout)
 * File: src/components/navComponents/Navigation.tsx
 *
 * Frame around every page. Shows the login screen while nobody is logged in, otherwise header, sidebar and
 * the page of the current URL (<Outlet />).
 *
 * Used by: 0.5 routes
 * Uses: 0.3 AuthProvider, 0.6.1 LoginScreen, 0.6.2 Header, 0.6.3 DesktopSidebar, 0.6.4 MobileSidebar
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header"; // 0.6.2 Header
import DesktopSidebar from "../sidebars/DesktopSidebar"; // 0.6.3 DesktopSidebar
import MobileSidebar from "../sidebars/MobileSidebar"; // 0.6.4 MobileSidebar
import { useAuth } from "../../contexts/AuthProvider"; // 0.3 AuthProvider
import LoginScreen from "../auth/LoginScreen"; // 0.6.1 LoginScreen


//import and using both, mobile and desktop sidebars responsively
function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isCheckingSession } = useAuth(); // 0.3 useAuth

    // Still waiting for the server to say whether we are logged in (GET /me)
    if (isCheckingSession) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#DBDDDF] dark:from-gray-900 dark:to-gray-950" />
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#DBDDDF] dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
                <LoginScreen /* 0.6.1 */ />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#F8FAFC] to-[#DBDDDF] text-[#111827] dark:bg-[linear-gradient(180deg,#0E1F48_62%,#0A286D_100%)] dark:text-[#F9FAFB]">
            <Header /* 0.6.2 */ />

            <div className="mainContent relative flex flex-1">

                {!isOpen && (
                    <div className="sm:hidden p-4 z-20">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="text-3xl text-[#111827] dark:text-[#F9FAFB]"
                        >
                            ☰
                        </button>
                    </div>
                )}

                <div className="py-8 flex items-start">
                    <DesktopSidebar /* 0.6.3 */ />
                </div>

                {/* Main page */}
                <div className="flex justify-center items-start flex-1 items-center">
                    <Outlet />
                </div>

                {/* Overlay */}
                {isOpen && (
                    <MobileSidebar
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default Navigation;

// → Next in the book: 0.6.1 LoginScreen  (src/components/auth/LoginScreen.tsx)
