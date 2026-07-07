import serverIcon from "../assets/ServerIcon.svg"

function ServerRoom() {
    return (
        <>
            <h1>Room 1</h1>
            <div className="border-4 border-solid border-[#6ADBAF] rounded-[10px]">
                <img
                        src={serverIcon}
                        alt="Server Icon"
                    />
            </div>
        </>
    )
}

export default ServerRoom;