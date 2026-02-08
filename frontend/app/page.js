"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listItems, createItem, updateItem, deleteItem } from "../lib/api";

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listItems();
      setItems(data);
    } catch (err) {
      if (err.message === "Unauthorized") {
        localStorage.removeItem("access_token");
        router.push("/login");
        return;
      }
      setError(err.message || "Error loading items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    refresh();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/login");
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createItem({ name, description });
      setName("");
      setDescription("");
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleUpdate(item) {
    const newName = prompt("New name", item.name) ?? item.name;
    const newDesc = prompt("New description", item.description || "") ?? item.description;
    try {
      await updateItem(item.id, { name: newName, description: newDesc });
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete ${item.name}?`)) return;
    try {
      await deleteItem(item.id);
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="grid">
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Products</h1>
          <button onClick={handleLogout} className="outline">Logout</button>
        </div>
        <p>Simple CRUD: add, update, delete, list</p>
      </div>

      <form className="card grid" onSubmit={handleAdd}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <button type="submit">Add Item</button>
      </form>

      <div className="card grid">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && items.length === 0 && <p>No items yet.</p>}

        {items.map((item) => (
          <div className="row" key={item.id}>
            <div>
              <strong>{item.name}</strong>
            </div>
            <div>{item.description || "-"}</div>
            <button className="secondary" onClick={() => handleUpdate(item)}>
              Update
            </button>
            <button className="danger" onClick={() => handleDelete(item)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
