import NavList from "./SidebarData";

type Props = {
    open: boolean;
    onClose: () => void;
};

function MobileSidebar({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="absolute inset-0 z-50 sm:hidden">

            {/* Sidebar */}
            <div className="relative w-full bg-[#F8FAFC] dark:bg-gray-900 border-b-4 border-[#6ADBAF] dark:border-[#3f8c6f] shadow-md">
                <div className="flex justify-start px-4">
                    <button onClick={onClose} className="text-2xl">
                        ✕
                    </button>
                </div>

                <nav className="flex flex-col items-center gap-2 pb-4">
                    <NavList onItemClick={onClose} />
                </nav>
            </div>
        </div>
    );
}

export default MobileSidebar;