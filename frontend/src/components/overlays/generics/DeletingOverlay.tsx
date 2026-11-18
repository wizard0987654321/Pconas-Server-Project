/* ==========================================================================
 * BOOK THREAD A.9  DeletingOverlay   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/components/overlays/generics/DeletingOverlay.tsx
 *
 * Generic "Are you sure you want to delete?" confirmation.
 *
 * Used by: 2.1 ServerRoomList, 2.2 ServerRoom, 2.5.11 OutsideEquipmentInfoOverlay, 3.1 ServerRacks,
 *   4.1 ServerDeviceTypes, 5.1 ServerDevices, 6.1 ServerVms, 7.1 ServerServices, 8.1 ServerCustomers
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useTranslation } from "react-i18next";

type DeletingOverlayProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

// common delete overlay for all deletions, either confirm or cancel
function DeletingOverlay({
    onConfirm,
    onCancel,
}: DeletingOverlayProps) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#F8FAFC] p-6 text-[#111827] shadow-lg dark:bg-[#0F234F] dark:text-[#F9FAFB]">
                <h2 className="mb-4 font-mono text-xl font-bold">
                    {t("common.deleteTitle")}
                </h2>

                <p className="mb-6 font-mono">
                    {t("common.deleteWarning")}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer rounded bg-[#FF6B6B] px-4 py-2 text-white hover:opacity-90"
                    >
                        {t("common.yes")}
                    </button>
                    <button
                        onClick={onCancel}
                        className="cursor-pointer rounded border border-[#6ADBAF] px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        {t("common.no")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeletingOverlay;

// → Next in the book: A.10 dataOperations  (src/helpers/hooks/dataOperations.ts)
