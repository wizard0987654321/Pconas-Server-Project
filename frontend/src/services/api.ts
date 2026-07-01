const API_URL = import.meta.env.VITE_API_URL;

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