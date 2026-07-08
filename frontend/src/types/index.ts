export type Room = {
    ID: number;
    Area: number;
    Capacity: number;
    HeightCm: number;
};

export type Rack = {
    ID: number;
    RoomID: number;
    Size: number;
};