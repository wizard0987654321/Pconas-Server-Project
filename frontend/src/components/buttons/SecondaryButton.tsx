type ButtonProps = {
    label: string,
    onClick: () => void
}

function SecondaryButton({
    label,
    onClick,
}: ButtonProps) {
    return (
        <>
            <button onClick={onClick} className="p-2 s:p-3 l:p-4 text-[#6ADBAF] font-mono font-bold text-base s:text-lg m:text-xl m-6 border-2 border-[#6ADBAF] rounded-[16px] hover:opacity-90 hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
                {label}
            </button>
        </>
    )
}

export default SecondaryButton;