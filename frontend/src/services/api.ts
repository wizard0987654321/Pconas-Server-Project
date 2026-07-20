const API_URL = import.meta.env.VITE_API_URL;

// get paths

export async function getHealth() {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
}

export async function getTestMessage() {
    const response = await fetch(`${API_URL}/testUrl`);

    if (!response.ok) {
        throw new Error("Failed test cudia");
    }

  return response.json();
}

export async function getRoomData() {
    const response = await fetch(`${API_URL}/rooms`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getRackData() {
    const response = await fetch(`${API_URL}/racks`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getDevicesData() {
    const response = await fetch(`${API_URL}/devices`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getVmsData() {
    const response = await fetch(`${API_URL}/vms`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getServicesData() {
    const response = await fetch(`${API_URL}/services`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getCustomersData() {
    const response = await fetch(`${API_URL}/customers`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getDeviceTypesData() {
    const response = await fetch(`${API_URL}/deviceTypes`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

//delete paths

export async function deleteRoom(id: number) {
    const response = await fetch(`${API_URL}/deleteRoom/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete room");
    }

    return response.json();
}

export async function deleteRack(id: number) {
    const response = await fetch(`${API_URL}/deleteRack/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete rack");
    }

    return response.json();
}

