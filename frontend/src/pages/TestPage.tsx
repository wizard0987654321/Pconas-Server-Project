import { useTranslation } from "react-i18next";

export default function TestPage() {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t("test.title")}</h1>
        </div>
    )
}