import NavList from "./SidebarData";

type Props = {
    open: boolean,
    onClose: () => void
};

function MobileSidebar({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="sm:hidden absolute top-16 left-0 z-50 w-64 bg-[#F8FAFC] dark:bg-gray-900 border-r-4 border-[#6ADBAF] dark:border-[#3f8c6f] shadow-lg">
            <button
                onClick={onClose}
                className="p-4 text-2xl"
            >
                ✕
            </button>
            <nav className="flex flex-col">
                <NavList onItemClick={onClose}/>
            </nav>
        </div>
    )
}

export default MobileSidebar;