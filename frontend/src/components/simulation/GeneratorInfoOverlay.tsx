import { useState } from "react";

import { deleteGenerator } from "../../services/api";
import DeletingOverlay from "../overlays/generics/DeletingOverlay";

type GeneratorInfoOverlayProps = {
    generatorId: number;
    // Shown name, e.g. "Generator 1"
    label: string;
    onClose: () => void;
    // Called after the generator was deleted (reload data)
    onDeleted: () => void;
    t: (key: string) => string;
};

// Info about an emergency generator, with a delete button (trainer and trainee)
function GeneratorInfoOverlay({ generatorId, label, onClose, onDeleted, t }: GeneratorInfoOverlayProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setConfirmDelete(false);
        try {
            await deleteGenerator(generatorId);
            onDeleted();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete generator");
        }
    };

    if (confirmDelete) {
        return <DeletingOverlay onConfirm={handleDelete} onCancel={() => setConfirmDelete(false)} />;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#F8FAFC] p-6 text-[#111827] shadow-lg dark:bg-[#0F234F] dark:text-[#F9FAFB]">
                <h2 className="mb-4 text-xl font-bold">{label}</h2>

                {error && <p className="mb-4 text-red-600">{error}</p>}

                <p className="mb-6">{t("pages.rooms.detailedView.power.generatorInfo")}</p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded border border-[#6ADBAF] px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        {t("common.close")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="cursor-pointer rounded bg-[#FF6B6B] px-4 py-2 text-white hover:opacity-90"
                    >
                        {t("pages.home.deleteButton")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GeneratorInfoOverlay;
