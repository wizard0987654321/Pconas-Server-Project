import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import DesktopSidebar from "../sidebars/DesktopSidebar";
import MobileSidebar from "../sidebars/MobileSidebar";

function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#DBDDDF] dark:from-gray-900 dark:to-gray-950">
            <Header />

            <div className="mainContent relative flex flex-1">

                {!isOpen && (
                    <div className="sm:hidden p-4 z-20">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="text-3xl text-black dark:text-white"
                        >
                            ☰
                        </button>
                    </div>
                )}

                <div className="py-8 flex items-start">
                    <DesktopSidebar />
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