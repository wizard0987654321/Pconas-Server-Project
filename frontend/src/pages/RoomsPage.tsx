import { useState } from "react";
import PageHeading from "../components/PageHeading";
import ServerRoom from "../components/PageContents/ServerRoom";
import ServerRoomList from "../components/ServerRoomList";

function RoomsPage() {
    const [listView, setListView] = useState(false);

    return (
        <>
            <div className="flex flex-row justify-center flex-wrap items-center p-4 w-full">
                <PageHeading heading="pages.rooms.headingText" />

                <div className="w-full flex justify-end m-4">
                    <button
                        onClick={() => setListView(!listView)}
                        className="px-4 py-2 rounded bg-[#6ADBAF]"
                    >
                        {listView ? "LW" : "VW"}
                    </button>
                </div>

                {listView ? <ServerRoomList /> : <ServerRoom />}
            </div>
        </>
    );
}

export default RoomsPage;