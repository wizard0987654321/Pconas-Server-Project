/* ==========================================================================
 * BOOK THREAD A.5  LoadingSpinner   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/components/LoadingSpinner.tsx
 *
 * Spinning circle shown while data is loading.
 *
 * Used by: 2.3.1 ActivateQuestionOverlay, 2.3.2 AnswerQuestionsOverlay, 2.6 DetailedRack
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

function LoadingSpinner() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#6ADBAF]/30 border-t-[#6ADBAF]"></div>
        </div>
    );
}

export default LoadingSpinner;

// → Next in the book: A.6 DataList  (src/components/DataList.tsx)
