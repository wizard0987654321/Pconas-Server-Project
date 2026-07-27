import NavList from "../navComponents/NavList";

type Props = {
    open: boolean;
    onClose: () => void;
};

function MobileSidebar({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="absolute inset-0 z-50 sm:hidden">

            {/* Sidebar */}
            <div className="relative w-full bg-[#F8FAFC] dark:bg-[#0F234F] border-b-4 border-[#6ADBAF] dark:border-[#6ADBAF] shadow-md">
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