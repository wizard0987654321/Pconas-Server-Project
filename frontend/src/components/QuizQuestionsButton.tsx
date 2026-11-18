/* ==========================================================================
 * BOOK THREAD 2.3  QuizQuestionsButton   (Chapter 2: Rooms)
 * File: src/components/QuizQuestionsButton.tsx
 *
 * Quiz button. Trainer: activates questions (2.3.1). Trainee: answers them (2.3.2).
 *
 * Used by: 2 RoomsPage
 * Uses: 0.3 AuthProvider, 2.3.1 ActivateQuestionOverlay, 2.3.2 AnswerQuestionsOverlay, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useState } from "react";
import PrimaryButton from "./buttons/PrimaryButton"; // A.2 PrimaryButton
import { useTranslation } from "react-i18next";
import ActivateQuestionOverlay from "./overlays/ActivateQuestionOverlay"; // 2.3.1 ActivateQuestionOverlay
import AnswerQuestionsOverlay from "./overlays/AnswerQuestionsOverlay"; // 2.3.2 AnswerQuestionsOverlay
import { useAuth } from "../contexts/AuthProvider"; // 0.3 AuthProvider

function QuizQuestions() {
    const { user } = useAuth(); // 0.3 useAuth
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    return (
        <>
            <PrimaryButton
                label={
                    user?.role === "trainer"
                        ? t("pages.rooms.activateQuestions")
                        : t("pages.rooms.answerQuestions")
                }
                onClick={handleClick}
                margin="m-0"
            />

            {open && user?.role === "trainer" && (
                <ActivateQuestionOverlay
                    onClose={() => setOpen(false)}
                />
            )}

            {open && user?.role === "trainee" && (
                <AnswerQuestionsOverlay
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

export default QuizQuestions;

// → Next in the book: 2.3.1 ActivateQuestionOverlay  (src/components/overlays/ActivateQuestionOverlay.tsx)
