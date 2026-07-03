import NavList from "./SidebarData";

type Props = {
    open: boolean;
    onClose: () => void;
};

function MobileSidebar({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="sm:hidden w-full bg-[#F8FAFC] dark:bg-gray-900 border-b-4 border-[#6ADBAF] dark:border-[#3f8c6f] shadow-md">
            
            {/* Top row */}
            <div className="flex justify-end p-4">
                <button onClick={onClose} className="text-2xl">
                    ✕
                </button>
            </div>

            {/* Nav content */}
            <nav className="flex flex-col items-center gap-2 pb-2">
                <NavList onItemClick={onClose} />
            </nav>
        </div>
    );
}

export default MobileSidebar;