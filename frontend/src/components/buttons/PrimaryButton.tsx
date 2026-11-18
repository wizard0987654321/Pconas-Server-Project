/* ==========================================================================
 * BOOK THREAD A.2  PrimaryButton   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/components/buttons/PrimaryButton.tsx
 *
 * Main green button.
 *
 * Used by: 0.6.1 LoginScreen, 1 Homepage, 2 RoomsPage, 2.2 ServerRoom, 2.3 QuizQuestionsButton,
 *   2.6 DetailedRack, 3 RacksPage, 4 DeviceTypesPage, 5 DevicesPage, 6 VmsPage, 7 ServicesPage,
 *   8 CustomersPage, A.6 DataList
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

type ButtonProps = {
    label: string;
    onClick: () => void;
    margin?: string;
};

function PrimaryButton({
    label,
    onClick,
    margin = "m-6",
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`animate-gradient-x p-2 s:p-3 l:p-4 text-white font-mono font-bold text-base s:text-lg m:text-xl ${margin} rounded-[16px] bg-gradient-to-r from-[#3FBC8B] via-[#6ADBAF] to-[#6ADBAF] hover:opacity-90 hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200`}
        >
            {label}
        </button>
    );
}

export default PrimaryButton;

// → Next in the book: A.3 SecondaryButton  (src/components/buttons/SecondaryButton.tsx)
