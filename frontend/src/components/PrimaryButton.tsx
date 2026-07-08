type ButtonProps = {
    label: string,
    onClick: () => void
}

function PrimaryButton({
    label,
    onClick,
}: ButtonProps) {
    return (
        <>
            <button onClick={onClick} className="animate-gradient-x p-2 s:p-3 l:p-4 text-white font-mono font-bold text-base s:text-lg m:text-xl m-6 rounded-[16px] bg-gradient-to-r from-[#3FBC8B] via-[#6ADBAF] to-[#6ADBAF] hover:opacity-90 hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200">
                {label}
            </button>
        </>
    )
}

export default PrimaryButton;