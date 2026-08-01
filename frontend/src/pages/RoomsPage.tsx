import { useState } from "react";
import PageHeading from "../components/PageHeading";
import ServerRoom from "../components/pageContents/ServerRoom";
import ServerRoomList from "../components/pageContents/ServerRoomList";
import listViewIcon from "../assets/listView.svg";
import roomViewIcon from "../assets/roomView.svg";
import PrimaryButton from "../components/buttons/PrimaryButton";
import AddRoomOverlay from "../components/overlays/AddRoomOverlay";
import { useTranslation } from "react-i18next";
import QuizQuestions from "../components/QuizQuestions";

function RoomsPage() {
    const { t } = useTranslation();

    const [isListView, setIsListView] = useState(false);
    const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

    // state for opening overlay
    const handleAddRoom = () => {
        setIsAddRoomOpen(true);
    };

    return (
        <>
            <div className="flex flex-col items-center p-4 w-full">
                <PageHeading heading="pages.rooms.headingText" />

                <div className="w-full flex justify-between items-center m-4">
                    <PrimaryButton
                        label={t("pages.rooms.addButton")}
                        onClick={handleAddRoom}
                        margin="m-1"
                    />

                    {/* two different possible views, list and room visual */}
                    <button
                        onClick={() => setIsListView(!isListView)}
                        className="p-2 rounded border-2 border-[#6ADBAF]"
                    >
                        <img
                            src={isListView ? roomViewIcon : listViewIcon}
                            alt={isListView ? "Room view" : "List view"}
                            className="size-5 m:size-10 l:size-12 cursor-pointer"
                        />
                    </button>
                </div>

                <div className="flex">
                    {isListView ? <ServerRoomList /> : <ServerRoom />}
                </div>
                <QuizQuestions />
            </div>
            {/* overlay, located in  src/components/overlays*/}
            {
                isAddRoomOpen && (
                    <AddRoomOverlay
                        onClose={() => setIsAddRoomOpen(false)}
                    />
                )
            }
        </>
    );
}

export default RoomsPage;