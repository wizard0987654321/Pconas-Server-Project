import { useState } from "react";
import PageHeading from "../components/PageHeading";
import ServerRoom from "../components/ServerRoom";
import ServerRoomList from "../components/ServerRoomList";
import listViewIcon from "../assets/listView.svg";
import roomViewIcon from "../assets/roomView.svg";

function RoomsPage() {
    const [isListView, setIsListView] = useState(false);

    return (
        <>
            <div className="flex flex-row justify-center flex-wrap items-center p-4 w-full">
                <PageHeading heading="pages.rooms.headingText" />

                <div className="w-full flex justify-end m-4">
                    <button
                        onClick={() => setIsListView(!isListView)}
                        className="p-2 rounded border border-2 border-[#6ADBAF]"
                    >
                        <img
                            src={isListView ? roomViewIcon : listViewIcon}
                            alt={isListView ? "Room view" : "List view"}
                            className="size-5 m:size-10 l:size-12 cursor-pointer"
                        />
                    </button>
                </div>

                {isListView ? <ServerRoomList /> : <ServerRoom />}
            </div>
        </>
    );
}

export default RoomsPage;