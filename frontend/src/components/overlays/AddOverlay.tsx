import { useState } from "react";

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
};

const API_URL = import.meta.env.VITE_API_URL;

function AddOverlay({
    title,
    fields,
    endpoint,
    onClose,
    transformData = (data) => data,
}: AddOverlayProps) {

    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = transformData(formData);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed request");
            }

            await response.json();

            onClose();
            window.location.reload();

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">

                <h2 className="mb-4 text-xl font-bold">
                    {title}
                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    {fields.map(field => (
                        <div key={field.name}>

                            <label className="mb-1 block font-medium">
                                {field.label}
                            </label>


                            {field.options ? (

                                <select
                                    value={formData[field.name] ?? ""}
                                    onChange={(e) =>
                                        handleChange(
                                            field.name,
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded border p-2"
                                    required
                                >
                                    <option value="">
                                        Select
                                    </option>

                                    {field.options.map(option => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            ) : (

                                <input
                                    type={field.type ?? "number"}
                                    value={formData[field.name] ?? ""}
                                    onChange={(e) =>
                                        handleChange(
                                            field.name,
                                            e.target.value
                                        )
                                    }
                                    min={field.min}
                                    step={field.step}
                                    className="w-full rounded border p-2"
                                    required
                                />

                            )}

                        </div>
                    ))}


                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border px-4 py-2"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="rounded bg-[#6ADBAF] px-4 py-2 text-white"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default AddOverlay;