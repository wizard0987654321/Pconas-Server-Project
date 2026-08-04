import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";
import {
    getQuestions,
    getAnswers,
    deactivateQuestions
} from "../../services/api";

type AnswerQuestionsOverlayProps = {
    onClose: () => void;
};

function AnswerQuestionsOverlay({ onClose }: AnswerQuestionsOverlayProps) {
    const { t, i18n } = useTranslation();

    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [feedback, setFeedback] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        setLoading(true);

        getQuestions()
            .then((data) => {
                setQuestions(
                    data.filter((q: any) => q.IsActive)
                );
            })
            .catch(console.error)
            .finally(() => setLoading(false));

        getAnswers()
            .then(setAnswers)
            .catch(console.error);

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const getQuestionText = (question: any) =>
        i18n.language === "de"
            ? question.QuestionDE
            : question.QuestionEN;

    const getAnswerText = (answer: any) =>
        i18n.language === "de"
            ? answer.AnswerDE
            : answer.AnswerEN;

    const handleAnswerSelect = (questionId: number, answerId: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleSubmit = async () => {
        const correctIds: number[] = [];
        const newFeedback: Record<number, boolean> = {};

        questions.forEach(question => {
            const selectedAnswerId = selectedAnswers[question.ID];

            if (!selectedAnswerId) {
                return;
            }

            const selectedAnswer = answers.find(
                answer => answer.ID === selectedAnswerId
            );

            if (!selectedAnswer) {
                return;
            }

            if (selectedAnswer.IsCorrect) {
                correctIds.push(question.ID);
                newFeedback[question.ID] = true;
            } else {
                newFeedback[question.ID] = false;
            }
        });

        setFeedback(newFeedback);

        if (correctIds.length > 0) {
            try {
                await deactivateQuestions(correctIds);

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } catch (error) {
                console.error("Failed to deactivate questions", error);
            }
        }
    };

    if (loading) {
         return <LoadingSpinner />;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-4">
            <div className="flex min-h-full items-center justify-center">
                <div className="w-full max-w-2xl rounded-xl bg-[#F8FAFC] p-6 text-[#111827] shadow-lg dark:bg-[#0F234F] dark:text-[#F9FAFB]">

                    <h2 className="mb-6 text-xl font-bold">{t("pages.rooms.answerQuestions")}</h2>

                    {questions.length === 0 ? (
                        <>
                            <p className="mb-6 text-center font-mono">{t("pages.rooms.noQuestions")}</p>

                            <div className="flex justify-end">
                                <button type="button" onClick={onClose} className="cursor-pointer rounded border border-[#6ADBAF] px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10">
                                    {t("common.close")}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col gap-6">
                                {questions.map(question => (
                                    <div key={question.ID} className="rounded-lg border border-[#6ADBAF] p-4">

                                        <p className="mb-4 font-semibold">{getQuestionText(question)}</p>

                                        <div className="flex flex-col gap-2">
                                            {answers
                                                .filter(answer => answer.QuestionID === question.ID)
                                                .map(answer => (
                                                    <label key={answer.ID} className="flex cursor-pointer items-center gap-2 rounded border border-[#6ADBAF] p-2 hover:bg-[#6ADBAF]/20">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.ID}`}
                                                            checked={selectedAnswers[question.ID] === answer.ID}
                                                            onChange={() => handleAnswerSelect(question.ID, answer.ID)}
                                                        />

                                                        {getAnswerText(answer)}
                                                    </label>
                                                ))}
                                        </div>

                                        {feedback[question.ID] === true && (
                                            <p className="mt-3 font-semibold text-green-600">{t("common.goodJob")}</p>
                                        )}

                                        {feedback[question.ID] === false && (
                                            <p className="mt-3 font-semibold text-red-600">{t("common.tryAgain")}</p>
                                        )}

                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={onClose} className="cursor-pointer rounded border border-[#6ADBAF] px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10">
                                    {t("common.close")}
                                </button>

                                <button type="button" onClick={handleSubmit} className="cursor-pointer rounded bg-[#6ADBAF] px-4 py-2 text-white hover:opacity-90">
                                    {t("common.submit")}
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default AnswerQuestionsOverlay;