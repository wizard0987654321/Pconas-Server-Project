import { Outlet, NavLink } from "react-router-dom";
import NavItem from "../components/NavItem";
import NavItemSeparation from "../components/NavItemSeparation";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";

function Navigation() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#DBDDDF] dark:from-gray-900 dark:to-gray-950">
            <header className="h-[15vh] w-full bg-[#F8FAFC] dark:bg-gray-900 border-4 border-[#6ADBAF] dark:border-[#3f8c6f] flex items-center justify-between px-4">
                <span className="font-mono text-3xl font-bold text-black-700 dark:text-gray-100">
                    Trainer
                </span>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <LanguageToggle />
                </div>
            </header>
            <div className="flex items-center h-[100vh]">
                <div
                    className="
                    flex flex-col
                    bg-[#F8FAFC] dark:bg-gray-900
                    border-4 border-[#6ADBAF] dark:border-[#3f8c6f]
                    h-[50vh]
                    w-[20vw]
                    rounded-r-[0.75rem] rounded-l-none
                    xs:scale-100
                    middle:scale-[2]
                    biggest:scale-[3]
                "
                >
                    <nav className="flex flex-col justify-between items-center w-full h-full">
                        <NavItem to="/" label="nav.home" />
                        <NavItemSeparation />
                        <NavItem to="rooms" label="nav.rooms" />
                        <NavItemSeparation />
                        <NavItem to="racks" label="nav.racks" />
                        <NavItemSeparation />
                        <NavItem to="devices" label="nav.devices" />
                        <NavItemSeparation />
                        <NavItem to="vms" label="nav.vms" />
                        <NavItemSeparation />
                        <NavItem to="services" label="nav.services" />
                    </nav>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
export default Navigation;