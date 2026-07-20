export type Room = {
    ID: number,
    RoomNumber: number,
    Area: number,
    Capacity: number,
    HeightCm: number;
};

export type Rack = {
    ID: number,
    RoomID: number,
    UnitsSize: number,
    HeightCm: number,
    RoomNumber: number
};

export type Device = {
    ID: number,
    DeviceNumber:number,
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
    VmNumber:number,
    ServiceID: number,
    DeviceID: number,
    Name: string,
    ServiceName: string
}

export type Service = {
    ID: number,
    ServiceNumber: number,
    Customer: string,
    Name: string;
}

export type Customer = {
    ID: number,
    CustomerNumber: number,
    Name: string,
    PhoneNumber: string
}

export type DeviceType = {
    ID: number,
    DeviceTypeNumber: number,
    TypeName: string,
    Manufacturer: string,
    Usage: string
}