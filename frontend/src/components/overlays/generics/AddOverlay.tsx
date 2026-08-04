import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type FieldConfig = {
    name: string;
    label: string;
    type?: string;
    min?: number;
    step?: number;
    options?: {
        label: string;
        value: string | number;
    }[];
};

type AddOverlayProps = {
    title: string;
    fields: FieldConfig[];
    endpoint: string;
    onClose: () => void;
    transformData?: (data: Record<string, string>) => any;
    validate?: (data: Record<string, string>) => string | null;
    initialData?: Record<string, string>;
};

const API_URL = import.meta.env.VITE_API_URL;

//general overlay that display received data, alongside input fields
function AddOverlay({
    title,
    fields,
    endpoint,
    onClose,
    transformData = (data) => data,
    validate,
    initialData,
}: AddOverlayProps) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<Record<string, string>>(initialData ?? {});
    const [errorMessage, setErrorMessage] = useState<string>("");

    //component hidden unless clicked on adding button
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    //two functions for data, writing and selecting input
    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");

        if (validate) {
            const validationError = validate(formData);

            if (validationError) {
                setErrorMessage(validationError);
                return;
            }
        }

        const data = transformData(formData);

        //post request, corresponding to the endpoint received
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed request");

            await response.json();

            onClose();
            window.location.reload();

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Failed request");
            console.error(error);
        }

        console.log(data);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-4">
            <div className="flex min-h-full items-center justify-center">
                <div className="w-full max-w-[18rem] max-h-[90vh] overflow-y-auto rounded-xl bg-[#F8FAFC] p-4 text-[#111827] shadow-lg dark:bg-[#0F234F] dark:text-[#F9FAFB] sm:max-w-sm sm:p-6">

                    <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">{title}</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">

                        {errorMessage && (
                            <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200">
                                {errorMessage}
                            </p>
                        )}

                        {/*mapping through passed prop, either input fields, or select options*/}
                        {fields.map(field => (
                            <div key={field.name}>

                                <label className="mb-1 block text-sm font-medium sm:text-base">
                                    {field.label}
                                </label>

                                {field.options ? (
                                    <select value={formData[field.name] ?? ""} onChange={(e) => handleChange(field.name, e.target.value)} className="w-full rounded border border-[#6ADBAF] bg-white p-1.5 text-sm text-[#111827] dark:bg-[#0E1F48] dark:text-[#F9FAFB] sm:p-2 sm:text-base" required>
                                        <option value="">{t("common.select")}</option>

                                        {field.options.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type={field.type ?? "number"} value={formData[field.name] ?? ""} onChange={(e) => handleChange(field.name, e.target.value)} min={field.min} step={field.step} className="w-full rounded border border-[#6ADBAF] bg-white p-1.5 text-sm text-[#111827] dark:bg-[#0E1F48] dark:text-[#F9FAFB] sm:p-2 sm:text-base" required />
                                )}

                            </div>
                        ))}

                        <div className="flex justify-end gap-2 sm:gap-3">

                            <button type="button" onClick={onClose} className="cursor-pointer rounded border border-[#6ADBAF] px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/10 sm:px-4 sm:py-2 sm:text-base">
                                {t("common.cancel")}
                            </button>

                            <button type="submit" className="cursor-pointer rounded bg-[#6ADBAF] px-3 py-1.5 text-sm text-white transition-opacity hover:opacity-90 sm:px-4 sm:py-2 sm:text-base">
                                {t("common.save")}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default AddOverlay;