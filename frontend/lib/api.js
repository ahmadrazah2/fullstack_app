const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function listItems() {
  const res = await fetch(`${API_BASE}/items`, {
    cache: "no-store",
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to fetch items");
  }
  return res.json();
}

export async function createItem(payload) {
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized. Please login.");
    throw new Error("Failed to create item");
  }
  return res.json();
}

export async function updateItem(id, payload) {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized. Please login.");
    throw new Error("Failed to update item");
  }
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized. Please login.");
    throw new Error("Failed to delete item");
  }
  return res.json();
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Registration failed");
  }
  return res.json();
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }
  return res.json();
}
