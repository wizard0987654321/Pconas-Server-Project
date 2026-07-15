import NavList from "./NavList";

function DesktopSidebar() {
    return (
        <div
            className="
                        hidden sm:flex
                        flex-col
                        bg-[#F8FAFC] dark:bg-gray-900
                        border-4 border-[#6ADBAF] dark:border-[#3f8c6f]
                        h-[80vh]
                        xl:h-[60vh]
                        w-[20vw]
                        rounded-r-[0.75rem] rounded-l-none
                        xs:scale-100
                        middle:scale-[2]
                        biggest:scale-[3]
                    "
        >
            <nav className="flex flex-col justify-between items-center w-full h-full">
                <NavList />
            </nav>
        </div>
    )
}

export default DesktopSidebar;