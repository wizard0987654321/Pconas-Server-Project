//centralised file for typescript types, used in whole code

export type Room = {
    ID: number,
    RoomNumber: number,
    Area: number,
    Capacity: number,
    HeightCm: number;
};

export type Rack = {
    ID: number,
    RackNumber: number,
    RoomID: number,
    UnitsSize: number,
    HeightCm: number,
    RoomNumber: number
};

export type Ups = {
    ID: number;
    UPSNumber: number;
    RoomID: number | null;
    UnitsSize: number | null;
    HeightCm: number | null;
}

export type Pdu = {
    ID: number;
    PDUNumber: number;
    RoomID: number;
    OutletCount: number | null;
    RoomNumber: number;
}

// Every row of the Equipment table is one of these ('grid' = fixed outer power source of a room)
export type EquipmentType = "grid" | "ups" | "pdu" | "rack";

// Fixed outer power source (utility grid), exactly one per room
export type PowerSource = {
    ID: number;
    RoomID: number;
}

// Cable between two pieces of equipment, IDs are Equipment IDs
export type Connection = {
    ID: number;
    RoomID: number;
    FromEquipmentID: number;
    FromType: EquipmentType;
    ToEquipmentID: number;
    ToType: EquipmentType;
    TypeID: number;
    TypeNameEN: string;
    TypeNameDE: string;
    Color: string;
}

export type Device = {
    ID: number,
    DeviceNumber:number,
    TypeID: number,
    TypeName: string,
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