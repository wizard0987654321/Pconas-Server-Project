import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./buttons/PrimaryButton";
import DeleteButton from "./buttons/DeleteButton";
import { useEffect, useRef } from "react";
import { dataListAnimation } from "../animations/dataListAnimation";

type DataListProps = {
    data: Record<string, any>[];
    detailPath?: string;
    detailLabel?: string;
    idField?: string; // defaults to "ID"
    onDelete?: (id: number) => void;
};


//general component used for each page to display data

function DataList({ data, detailPath, detailLabel, idField = "ID", onDelete }: DataListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();


    //simple animation for dataList component
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        dataListAnimation(containerRef.current);
    }, [data]);

    if (!data.length) return null;

    //setting up grid for the right size, dynamic for different sized data
    const columns = Object.keys(data[0]).filter((key) => key !== idField);
    const actionColumnWidth = detailPath ? "minmax(14rem, 1fr)" : "minmax(8rem, 1fr)";

    const gridStyle = {
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr)) ${actionColumnWidth}`,
    };


    //for example detailed rack view, also possible for other pages
    const handleViewDetails = (row: Record<string, any>) => {
        navigate(`${detailPath}/${row[idField]}`);
    };

    const handleDelete = (row: Record<string, any>) => {
        if (onDelete) {
            onDelete(row[idField]);
        }
    };

    return (
        <div className="w-full rounded-xl p-3 s:p-8 lg:p-10 font-mono text-[#111827] dark:text-[#F9FAFB]" ref={containerRef}>

            {/* Desktop Header */}
            <div
                className="hidden xl:grid gap-x-4 font-semibold m:text-lg border-b-2 border-[#6ADBAF] pb-4 mb-3"
                style={gridStyle}
            >
                {columns.map((column) => (
                    <span key={column} className="px-3 min-w-0">
                        {column === "#" ? "#" : t(column)}
                    </span>
                ))}

                <span className="px-3" />
            </div>

            <div className="space-y-3 xl:space-y-0">
                {data.map((row, index) => (
                    <div key={index} className="data-list-row">

                        {/* Mobile */}
                        <div className="xl:hidden rounded-lg text-sm m:text-xl border-3 border-[#6ADBAF] p-4 space-y-2 bg-[#F8FAFC] dark:bg-[#0F234F]">
                            {columns.map((key) => (
                                <div key={key} className="flex items-center">
                                    <span className="p-2 font-bold text-[#6ADBAF] shrink-0">
                                        {key === "#" ? "#" : t(key)}
                                    </span>

                                {/*for boolean type values*/}
                                    <span
                                        className={`ml-auto text-right break-words ${typeof row[key] === "boolean" && !row[key]
                                            ? "text-[#FF6B6B] font-bold" //red for answer no, so it's more visible
                                            : ""
                                            }`}
                                    >
                                        {typeof row[key] === "boolean" //only for boolean type columns
                                            ? row[key]
                                                ? t("common.yes")
                                                : t("common.no")
                                            : row[key]}
                                    </span>
                                </div>
                            ))}

                            {/* view details button visible only when detail path is passed as prop */}
                            {detailPath && (
                                <div className="flex justify-center">
                                    <PrimaryButton
                                        label={detailLabel ? t(detailLabel) : t("common.viewDetails")}
                                        onClick={() => handleViewDetails(row)}
                                    />
                                </div>
                            )}

                            <DeleteButton
                                label={t("pages.home.deleteButton")}
                                onClick={() => handleDelete(row)}
                            />
                        </div>


                        {/* Desktop */}
                        <div
                            className="hidden xl:grid gap-x-4 py-5 m:text-lg border-b-2 border-[#6ADBAF] items-center"
                            style={gridStyle}
                        >
                            {columns.map((column) => (
                                <span className={`p-1 min-w-0 break-words ${typeof row[column] === "boolean" && !row[column]
                                    ? "text-[#FF6B6B] font-bold" //red for answer no, so it's more visible
                                    : ""
                                    }`} key={column}>
                                    {typeof row[column] === "boolean"
                                        ? row[column] ? t("common.yes") : t("common.no") //for boolean type columns
                                        : row[column]}
                                </span>
                            ))}

                            <div className="flex w-full items-center justify-end gap-2 lg:gap-3 xl:gap-4 pr-1">
                                {/* view details button visible only when detail path is passed as prop */}
                                {detailPath && (
                                    <PrimaryButton
                                        label={detailLabel ? t(detailLabel) : t("common.viewDetails")}
                                        onClick={() => handleViewDetails(row)}
                                        margin="my-0"
                                    />
                                )}

                                <DeleteButton
                                    label={t("pages.home.deleteButton")}
                                    onClick={() => handleDelete(row)}
                                />
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default DataList;




