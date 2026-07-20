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

export async function deleteDeviceType(id: number) {
    const response = await fetch(`${API_URL}/deleteDeviceType/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete device type");
    }

    return response.json();
}

export async function deleteDevice(id: number) {
    const response = await fetch(`${API_URL}/deleteDevice/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete device");
    }

    return response.json();
}

export async function deleteService(id: number) {
    const response = await fetch(`${API_URL}/deleteService/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete service");
    }

    return response.json();
}

export async function deleteCustomer(id: number) {
    const response = await fetch(`${API_URL}/deleteCustomer/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete customer");
    }

    return response.json();
}

export async function deleteVm(id: number) {
    const response = await fetch(`${API_URL}/deleteVm/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete VM");
    }

    return response.json();
}

export async function addService(payload: { newService: { name: string; customerId: number } }) {
    const response = await fetch(`${API_URL}/addService`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to add service");
    }

    return response.json();
}

export async function addCustomer(payload: { newCustomer: { name: string; phoneNumber: string } }) {
    const response = await fetch(`${API_URL}/addCustomer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to add customer");
    }

    return response.json();
}

export async function addVm(payload: { newVm: { deviceId: number; serviceId: number; name: string } }) {
    const response = await fetch(`${API_URL}/addVm`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to add VM");
    }

    return response.json();
}

