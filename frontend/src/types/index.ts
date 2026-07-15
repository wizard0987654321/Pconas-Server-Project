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
    Manufacturer: string,
    Usage: string
}

export type VM = {
    ID: number,
    ServiceID: number,
    DeviceID: number,
    Name: string,
    ServiceName: string
}

export type Service = {
    ID: number,
    Customer: string,
    Name: string;
}

export type Customer = {
    ID: number,
    Name: string,
    PhoneNumber: string
}

export type DeviceType = {
    ID: number,
    TypeName: string,
    Manufacturer: string,
    Usage: string
}