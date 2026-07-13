export type Room = {
    ID: number,
    Area: number,
    Capacity: number,
    HeightCm: number;
};

export type Rack = {
    ID: number,
    RoomID: number,
    UnitsSize: number,
    HeightCm: number
};

export type Device = {
    ID: number,
    TypeID: number,
    RackID: number,
    InternalID: string,
    PositionFrom: number,
    PositionTo: number,
    ElectricityConnected: boolean,
    TORConnected: boolean
}

export type VM = {
    ID: number,
    ServiceID: number,
    DeviceID: number,
    Name: string;
}

export type Service = {
    ID: number,
    CustomerID: number,
    Name: string;
}