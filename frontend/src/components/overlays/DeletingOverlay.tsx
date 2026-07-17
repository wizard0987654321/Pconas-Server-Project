type DeletingOverlayProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

function DeletingOverlay({
    onConfirm,
    onCancel,
}: DeletingOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 font-mono text-xl font-bold">
                    Are you sure you want to delete?
                </h2>

                <p className="mb-6 font-mono">
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer rounded bg-[#FF6B6B] px-4 py-2 text-white hover:opacity-90"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onCancel}
                        className="cursor-pointer rounded border px-4 py-2"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeletingOverlay;