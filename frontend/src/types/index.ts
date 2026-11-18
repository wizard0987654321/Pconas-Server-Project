/* ==========================================================================
 * BOOK THREAD A.13  types   (Chapter A: Appendix: generic parts used everywhere)
 * File: src/types/index.ts
 *
 * All shared TypeScript types (Room, Rack, Device, Connection, Fault, ...), matching the backend responses.
 *
 * DATA - backend requests or types, renders no HTML.
 *
 * Used by: 2.2 ServerRoom, 2.2.2 RackHoverCard, 2.2.3 UpsHoverCard, 2.5 DetailedRoom, 2.5.1 useRoomData,
 *   2.5.2 usePowerFlow, 2.5.2.1 powerFlow, 2.5.3 roomClimate, 2.5.3.1 inRackUps, 2.5.5 useEquipmentLabels,
 *   2.5.6 useTrainerSelection, 2.5.8 PowerSource, 2.5.8.2 FaultText, 2.5.12 CableChangeOverlay,
 *   2.5.13 TrainerPanel, 2.5.16 ConnectionHoverCard, 2.5.17 PduHoverCard, 2.6 DetailedRack,
 *   2.6.2 EditDeviceOverlay, A.10.1 roomOperations, A.10.2 rackOperations, A.10.3 deviceTypeOperations,
 *   A.10.4 deviceOperations, A.10.5 vmOperations, A.10.6 serviceOperations, A.10.7 customerOperations,
 *   A.12.3 rooms, A.12.4 equipment, A.12.5 connections, A.12.6 devices, A.12.7 services, A.12.9 faults
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

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

// Every row of the Equipment table is one of these
// ('grid' = fixed outer power source of a room, 'generator' = emergency power source added by the trainee)
export type EquipmentType = "grid" | "generator" | "ups" | "pdu" | "rack";

// Power source of a room: exactly one grid, plus up to two generators
export type PowerSource = {
    ID: number;
    RoomID: number;
    Type: "grid" | "generator";
}

// Fan standing left / right of the grid (no cables, only displayed)
export type Fan = {
    ID: number;
    RoomID: number;
}

// Kinds of faults the trainer can cause (grows step by step, same list as CK_Fault_Type in the DB)
export type FaultType = "damaged";

// Fault caused by the trainer, on exactly one piece of equipment OR one cable.
// GET /faults only returns active ones (ResolvedAt null). Times are UTC ISO strings.
export type Fault = {
    ID: number;
    RoomID: number;
    EquipmentID: number | null;
    ConnectionID: number | null;
    FaultType: FaultType;
    StartedAt: string;
    ResolvedAt: string | null;
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
    // In-rack UPS device this device is plugged into, null = rack power feed directly
    PoweredByDeviceID: number | null,
    Manufacturer: string,
    Usage: string,
    // Device type is an in-rack UPS
    IsUps: boolean
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
    Usage: string,
    IsUps: boolean
}

// → Next in the book: A.14.1 homepage  (src/animations/homepage.ts)
