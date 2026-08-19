import { useState } from "react";
import PrimaryButton from "./buttons/PrimaryButton";
import { useTranslation } from "react-i18next";
import ActivateQuestionOverlay from "./overlays/ActivateQuestionOverlay";
import AnswerQuestionsOverlay from "./overlays/AnswerQuestionsOverlay";
import { useAuth } from "../contexts/AuthProvider";

function QuizQuestions() {
    const { user } = useAuth();
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