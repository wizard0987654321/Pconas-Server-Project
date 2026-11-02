import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

function DetailedRoom() {

    const { t } = useTranslation();
    const { id } = useParams();

    return (
        <>
            {/*For the screens smaller than 768px, size m*/}
            <div className="hidden max-m:flex min-h-screen items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold">
                    {t("pages.rooms.detailedView.smallScreen")}
                </h1>
            </div>

            {/*For the screens bigger than 768px, size m*/}
            <h1 className="hidden m:flex">This is test detailed Room page. Room ID: {id}</h1>
        </>
    );
}

export default DetailedRoom;