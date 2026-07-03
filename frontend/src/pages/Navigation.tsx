import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import DesktopSidebar from "../components/DesktopSidebar";
import MobileSidebar from "../components/MobileSidebar";

function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#DBDDDF] dark:from-gray-900 dark:to-gray-950">
            <Header />

            {/* Mobile burger button */}
            <div className="sm:hidden p-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-3xl text-black dark:text-white"
                >
                    ☰
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && <MobileSidebar 
                open={isOpen}
                onClose={() => setIsOpen(false)} />
            }

            <div className="flex items-center min-h-screen">
                {/* Desktop sidebar */}
                <DesktopSidebar />

                {/* Main content */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Navigation;