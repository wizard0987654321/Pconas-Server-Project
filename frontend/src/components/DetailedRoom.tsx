import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PageHeading from "./PageHeading";
import { useState, useEffect } from "react";
import type { Rack } from "../types";
import { getRackData } from "../services/api";
import serverIcon from "../assets/ServerIcon.svg";
import RackHoverOverlay from "./RackHoverOverlay";

function DetailedRoom() {

    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [racksData, setRacksData] = useState<Rack[]>([]);

    useEffect(() => {
        getRackData()
            .then((data) => {
                setRacksData(data);
            })
            .catch((err) => {
                console.error("API error", err);
            });
    }, []);

    // Only get racks belonging to the currently selected room
    const roomRacks = racksData.filter(
        rack => rack.RoomID === Number(id)
    );

    const handleRackClick = (rackId: number) => {
        navigate(`/racks/${rackId}`);
    };

    return (
        <>
            <div className="flex min-h-screen w-full flex-col p-10">

                <div className="hidden max-m:flex min-h-screen items-center justify-center p-6 text-center">
                    <h1 className="text-2xl font-bold">
                        {t("pages.rooms.detailedView.smallScreen")}
                    </h1>
                </div>

                <PageHeading heading={`${t("pages.rooms.cardHeading")} ${id}`} />

                <div className="my-15 flex w-full flex-wrap items-center justify-around gap-4 rounded-[0.5rem] border-[1rem] border-[#6ADBAF] p-6">
                    {roomRacks.map(rack => (
                        <div key={rack.ID} className="relative group flex justify-center">

                            <img
                                src={serverIcon}
                                alt="Server Icon"
                                onClick={() => handleRackClick(rack.ID)}
                                className="rack-item cursor-pointer transition-transform duration-150 hover:scale-110"
                            />

                            <RackHoverOverlay rack={rack} t={t} />

                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}

export default DetailedRoom;