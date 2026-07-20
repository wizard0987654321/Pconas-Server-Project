type ButtonProps = {
    label: string,
    onClick: () => void
}

function DeleteButton({
    label,
    onClick,
}: ButtonProps) {
    return (
        <>
            <div className="flex justify-center">
                <button
                    onClick={onClick}
                    className="p-2 s:p-3 l:p-4 text-[#FF6B6B] font-mono font-bold text-base s:text-lg m:text-xl m-2 border-2 border-[#FF6B6B] rounded-[16px] hover:bg-[#FF6B6B] hover:text-white hover:opacity-90 hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                    {label}
                </button>
            </div>
        </>
    )
}

export default DeleteButton;