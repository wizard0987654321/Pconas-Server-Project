import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./buttons/PrimaryButton";
import DeleteButton from "./buttons/DeleteButton";

type DataListProps = {
    data: Record<string, any>[];
    detailPath?: string;
    detailLabel?: string;
    idField?: string; // defaults to "ID"
    onDelete?: (id: number) => void;
};

function DataList({ data, detailPath, detailLabel, idField = "ID", onDelete }: DataListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!data.length) return null;

    const columns = Object.keys(data[0]).filter((key) => key !== idField);
    const columnCount = columns.length + (detailPath ? 1 : 0) + 1; // +1 for delete button

    const gridStyle = {
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    };

    const handleViewDetails = (row: Record<string, any>) => {
        navigate(`${detailPath}/${row[idField]}`);
    };

    const handleDelete = (row: Record<string, any>) => {
        if (onDelete) {
            onDelete(row[idField]);
        }
    };

    return (
        <div className="w-full rounded-xl p-3 s:p-8 lg:p-10 font-mono">

            {/* Desktop Header */}
            <div
                className="hidden xl:grid font-semibold m:text-lg border-b-2 border-[#6ADBAF] pb-4 mb-3"
                style={gridStyle}
            >
                {columns.map((column) => (
                    <span key={column} className="px-3">
                        {column === "#" ? "#" : t(column)}
                    </span>
                ))}

                {detailPath && <span className="px-3" />}
                <span className="px-3" />
            </div>

            <div className="space-y-3 xl:space-y-0">
                {data.map((row, index) => (
                    <div key={index}>

                        {/* Mobile */}
                        <div className="xl:hidden rounded-lg text-sm m:text-xl border-3 border-[#6ADBAF] p-4 space-y-2 bg-white">
                            {columns.map((key) => (
                                <div key={key} className="flex items-center">
                                    <span className="p-2 font-bold text-[#6ADBAF] shrink-0">
                                        {key === "#" ? "#" : t(key)}
                                    </span>

                                    <span
                                        className={`ml-auto text-right break-words ${typeof row[key] === "boolean" && !row[key]
                                            ? "text-[#FF6B6B] font-bold" //red for answer no, so it's more visible
                                            : ""
                                            }`}
                                    > 
                                        {typeof row[key] === "boolean" //only for boolean type columns
                                            ? row[key]
                                                ? "Yes"
                                                : "No"
                                            : row[key]}
                                    </span>
                                </div>
                            ))}

                            {detailPath && (
                                <PrimaryButton
                                    label={detailLabel ? t(detailLabel) : t("common.viewDetails")}
                                    onClick={() => handleViewDetails(row)}
                                />
                            )}

                            <DeleteButton
                                label="Delete"
                                onClick={() => handleDelete(row)}
                            />
                        </div>


                        {/* Desktop */}
                        <div
                            className="hidden xl:grid py-5 m:text-lg border-b-2 border-[#6ADBAF] items-center"
                            style={gridStyle}
                        >
                            {columns.map((column) => (
                                <span className={`p-1 ${typeof row[column] === "boolean" && !row[column]
                                    ? "text-[#FF6B6B] font-bold" //red for answer no, so it's more visible
                                    : ""
                                    }`} key={column}>
                                    {typeof row[column] === "boolean"
                                        ? row[column] ? "Yes" : "No" //for boolean type columns
                                        : row[column]}
                                </span>
                            ))}

                            {detailPath && (
                                <span className="p-1">
                                    <PrimaryButton
                                        label={detailLabel ? t(detailLabel) : t("common.viewDetails")}
                                        onClick={() => handleViewDetails(row)}
                                        margin="my-0"
                                    />
                                </span>
                            )}

                            <span className="p-1">
                                <DeleteButton
                                    label={t("pages.home.deleteButton")}
                                    onClick={() => handleDelete(row)}
                                />
                            </span>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default DataList;




