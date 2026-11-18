/* ==========================================================================
 * BOOK THREAD A.4  DeleteButton   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/components/buttons/DeleteButton.tsx
 *
 * Red outlined delete button.
 *
 * Used by: 2.2 ServerRoom, A.6 DataList
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

type ButtonProps = {
    label: string,
    onClick: () => void
}

function DeleteButton({
    label,
    onClick,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="my-2 p-2 s:p-3 l:p-4 text-[#FF6B6B] font-mono font-bold text-base s:text-lg m:text-xl border-2 border-[#FF6B6B] rounded-[16px] hover:bg-[#FF6B6B] hover:text-white hover:opacity-90 hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
            {label}
        </button>
    )
}

export default DeleteButton;

// → Next in the book: A.5 LoadingSpinner  (src/components/LoadingSpinner.tsx)
