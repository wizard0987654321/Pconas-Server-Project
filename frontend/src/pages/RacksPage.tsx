import ServerRacks from "../components/pageContents/ServerRacks";
import PageHeading from "../components/PageHeading";
import { useParams } from "react-router-dom";
import { useState } from "react";
import AddRackOverlay from "../components/overlays/AddRackOverlay";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { useTranslation } from "react-i18next";


function RacksPage() {
    const { t } = useTranslation();

    const { roomId } = useParams();

    const [isAddRackOpen, setIsAddRackOpen] = useState(false);

    // state for opening overlay
    const handleRackAdded = () => {
        setIsAddRackOpen(true);
    }

    return (
        <div className="flex flex-col justify-center flex-wrap items-center p-4 w-full">
            <PageHeading heading="Racks" />
            <div className="w-[100%] flex flex-start">
                <PrimaryButton label={t("pages.racks.addButton")} onClick={handleRackAdded} margin="m-1" />
            </div>
            <ServerRacks internalRoomId={roomId} />

            {/* overlay, located in  src/components/overlays*/}
            {isAddRackOpen && (
                <AddRackOverlay
                    onClose={() => setIsAddRackOpen(false)}
                />
            )}
        </div>
    );
}

export default RacksPage;