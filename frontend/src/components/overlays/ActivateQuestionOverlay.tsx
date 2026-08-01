import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { activateQuestions, getQuestions } from "../../services/api";

type Props = {
    onClose: () => void;
};

function ActivateQuestionOverlay({ onClose }: Props) {
    const { i18n, t } = useTranslation();

    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        setLoading(true);

        getQuestions()
            .then((data) =>
                setQuestions(
                    data.filter((q: any) => !q.IsActive)
                )
            )
            .finally(() => setLoading(false));

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const getQuestionText = (q: any) =>
        i18n.language === "de"
            ? q.QuestionDE
            : q.QuestionEN;

    const handleSelect = (question: any) => {
        if (selectedQuestions.some((q) => q.ID === question.ID)) {
            return;
        }

        setSelectedQuestions((prev) => [...prev, question]);
    };

    const handleActivate = async () => {
        const ids = selectedQuestions.map((q) => q.ID);

        await activateQuestions(ids);

        onClose();

        window.location.reload();
    };

    if (loading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 p-3 sm:p-4">
            <div className="flex min-h-full items-center justify-center">

                <div className="w-full max-w-md rounded-xl bg-[#F8FAFC] p-6 text-[#111827] shadow-lg dark:bg-[#0F234F] dark:text-[#F9FAFB]">

                    <h2 className="mb-4 text-xl font-bold">
                        {t("questions.chooseQuestions")}
                    </h2>

                    <select
                        className="w-full rounded border border-[#6ADBAF] bg-white p-2 dark:bg-[#0E1F48]"
                        onChange={(e) => {
                            const id = Number(e.target.value);

                            const question = questions.find(
                                (q) => q.ID === id
                            );

                            if (question) {
                                handleSelect(question);
                            }

                            e.target.value = "";
                        }}
                    >
                        <option value="">
                            {t("common.select")}
                        </option>

                        {questions.map((q) => (
                            <option
                                key={q.ID}
                                value={q.ID}
                            >
                                {getQuestionText(q)}
                            </option>
                        ))}
                    </select>

                    <div className="mt-4 flex flex-col gap-2">
                        {selectedQuestions.map((q) => (
                            <div
                                key={q.ID}
                                className="rounded border border-[#6ADBAF] p-2"
                            >
                                {getQuestionText(q)}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">

                        <button
                            onClick={onClose}
                            className="cursor-pointer rounded border border-[#6ADBAF] px-4 py-2"
                        >
                            {t("common.cancel")}
                        </button>

                        <button
                            onClick={handleActivate}
                            disabled={!selectedQuestions.length}
                            className="cursor-pointer rounded bg-[#6ADBAF] px-4 py-2 text-white disabled:opacity-50"
                        >
                            {t("common.save")}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ActivateQuestionOverlay;