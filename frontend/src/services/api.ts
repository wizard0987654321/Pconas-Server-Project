//api requests, communication with server

//variable url, so when it is hosted i can just change this url 
const API_URL = import.meta.env.VITE_API_URL;

// AuthProvider listens for this event and logs the user out in the UI
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

// Every request to the backend goes through here.
// credentials: "include" makes the browser send the httpOnly login cookie along
// (by default fetch does not send cookies to another origin, 5173 -> 5000).
// A 401 means the session expired / is invalid, so the UI is told to log out.
export async function apiFetch(path: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
    });

    // /me and /login answer 401 as a normal "not logged in" / "wrong password", no event for those
    if (response.status === 401 && path !== "/me" && path !== "/login") {
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return response;
}

//auth paths

export type AuthUser = {
    id: number;
    username: string;
    role: "trainer" | "trainee";
};

// Returns the user on success. Throws "INVALID_CREDENTIALS" for a wrong
// username/password, any other error means the server could not be reached.
export async function login(username: string, password: string): Promise<AuthUser> {
    const response = await apiFetch(`/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.status === 401 || response.status === 400) {
        throw new Error("INVALID_CREDENTIALS");
    }

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return response.json();
}

export async function logout() {
    await apiFetch(`/logout`, { method: "POST" });
}

// Asks the server who is logged in (based on the cookie). null = nobody.
export async function getMe(): Promise<AuthUser | null> {
    const response = await apiFetch(`/me`);

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to get current user");
    }

    return response.json();
}

//two test paths
export async function getHealth() {
  const response = await apiFetch(`/`);

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
}

export async function getTestMessage() {
    const response = await apiFetch(`/testUrl`);

    if (!response.ok) {
        throw new Error("Failed test cudia");
    }

  return response.json();
}


// get paths
export async function getRoomData() {
    const response = await apiFetch(`/rooms`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getRackData() {
    const response = await apiFetch(`/racks`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getUpsData() {
    const response = await apiFetch(`/ups`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getPduData() {
    const response = await apiFetch(`/pdus`);

    if (!response.ok) {
        throw new Error("Failed Database getPduData Query");
    }

    return response.json();
}

export async function getConnectionsData() {
    const response = await apiFetch(`/connections`);

    if (!response.ok) {
        throw new Error("Failed Database getConnectionsData Query");
    }

    return response.json();
}

export async function getDevicesData() {
    const response = await apiFetch(`/devices`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getVmsData() {
    const response = await apiFetch(`/vms`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getServicesData() {
    const response = await apiFetch(`/services`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getCustomersData() {
    const response = await apiFetch(`/customers`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getDeviceTypesData() {
    const response = await apiFetch(`/deviceTypes`);

    if (!response.ok) {
        throw new Error("Failed Database Test Query");
    }

    return response.json();
}

export async function getQuestions() {
    const response = await apiFetch(`/questions`);

    if (!response.ok) {
        throw new Error("Failed Database getQuestions Query");
    }

    return response.json();
}

export async function getAnswers() {
    const response = await apiFetch(`/answers`);

    if (!response.ok) {
        throw new Error("Failed Database getAnswers Query");
    }

    return response.json();
}


//delete paths

export async function deleteRoom(id: number) {
    const response = await apiFetch(`/deleteRoom/${id}`, {
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
    const response = await apiFetch(`/deleteRack/${id}`, {
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
    const response = await apiFetch(`/deleteDeviceType/${id}`, {
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
    const response = await apiFetch(`/deleteDevice/${id}`, {
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
    const response = await apiFetch(`/deleteService/${id}`, {
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
    const response = await apiFetch(`/deleteCustomer/${id}`, {
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
    const response = await apiFetch(`/deleteVm/${id}`, {
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


//post paths
export async function addService(payload: { newService: { name: string; customerId: number } }) {
    const response = await apiFetch(`/addService`, {
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
    const response = await apiFetch(`/addCustomer`, {
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
    const response = await apiFetch(`/addVm`, {
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

export async function addConnections(
    connections: { fromEquipmentId: number; toEquipmentId: number; typeId?: number }[]
) {
    const response = await apiFetch(`/addConnections`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ connections }),
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to add connections");
    }

    return response.json();
}

//update paths

export async function activateQuestions(ids: number[]) {
    return apiFetch(`/activateQuestions`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
    });
}

export async function deactivateQuestions(ids: number[]) {
    const response = await apiFetch(`/deactivateQuestions`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
    });

    return response.json();
}
