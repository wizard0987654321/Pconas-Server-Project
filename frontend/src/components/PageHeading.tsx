import { useTranslation } from "react-i18next";

type PageHeadingProps = {
    heading: string
}

function PageHeading(
    { heading }: PageHeadingProps
) {
    const { t } = useTranslation();

    return (
        <div className="m-2 px-2 py-3 s:py-4 m:py-5 l:py-6 border-[8px] s:border-[12px] m:border-[16px] l:border-[18px] border-solid border-[#6ADBAF] rounded-[16px]">
            <h1 className="font-mono font-bold text-center text-black dark:text-red-600 text-3xl xs:text-4xl s:text-5xl m:text-6xl l:text-7xl">
                {t(heading)}
            </h1>
        </div>
    )
}

export default PageHeading;