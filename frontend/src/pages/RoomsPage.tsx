/* ==========================================================================
 * BOOK THREAD 2  RoomsPage   (Chapter 2: Rooms)
 * File: src/pages/RoomsPage.tsx
 *
 * All server rooms. Switches between the list view (2.1) and the room view (2.2), opens the quiz (2.3) and
 * adds rooms (2.4).
 *
 * Reached via: URL /rooms  (sidebar link "Rooms", button on the Homepage 1)
 * Used by: 0.5 routes
 * Uses: 2.1 ServerRoomList, 2.2 ServerRoom, 2.3 QuizQuestionsButton, 2.4 AddRoomOverlay, A.1 PageHeading,
 *   A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useState } from "react";
import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import ServerRoom from "../components/pageContents/ServerRoom"; // 2.2 ServerRoom
import ServerRoomList from "../components/pageContents/ServerRoomList"; // 2.1 ServerRoomList
import listViewIcon from "../assets/listView.svg";
import roomViewIcon from "../assets/roomView.svg";
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
import AddRoomOverlay from "../components/overlays/AddRoomOverlay"; // 2.4 AddRoomOverlay
import { useTranslation } from "react-i18next";
import QuizQuestions from "../components/QuizQuestionsButton"; // 2.3 QuizQuestionsButton

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
            <div className="flex w-full min-w-0 flex-col items-center overflow-x-hidden p-4">
                <PageHeading heading="pages.rooms.headingText" />
                <div className="m-4 flex w-full min-w-0 items-center justify-between">                    <PrimaryButton
                    label={t("pages.rooms.addButton")}
                    onClick={handleAddRoom}
                    margin="m-1"
                />

                    {/* two different possible views, list and room visual */}
                    <button
                        onClick={() => setIsListView(!isListView)}
                        className="shrink-0 rounded border-2 border-[#6ADBAF] p-2"                    >
                        <img
                            src={isListView ? roomViewIcon : listViewIcon}
                            alt={isListView ? "Room view" : "List view"}
                            className="size-5 m:size-10 l:size-12 cursor-pointer"
                        />
                    </button>
                </div>

                <div className="w-full min-w-0 max-w-full">
                    {isListView ? <ServerRoomList /* 2.1 */ /> : <ServerRoom /* 2.2 */ />}
                </div>
                <QuizQuestions /* 2.3 */ />
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

// → Next in the book: 2.1 ServerRoomList  (src/components/pageContents/ServerRoomList.tsx)
