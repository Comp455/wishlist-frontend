import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const API_BASE = "https://wishlist-backend-wlvx.onrender.com";

const categories = [
  { name: "Casa", color: "#f87171" },
  { name: "Svago", color: "#60a5fa" },
  { name: "Scrivania", color: "#34d399" },
  { name: "Libri", color: "#fbbf24" }
];

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ url: "", category: "Casa", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", url: "", category: "Casa" });

  const fetchItems = async () => {
    const res = await axios.get(`${API_BASE}/api/items`);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${API_BASE}/api/items`, form);
    setItems([...items, res.data]);
    setForm({ url: "", category: "Casa", price: "" });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/api/items/${id}`);
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      price: item.price,
      url: item.url,
      category: item.category
    });
  };

  const handleEditSubmit = async (id) => {
    const res = await axios.patch(`${API_BASE}/api/items/${id}`, editForm);
    setItems(items.map(item => item.id === id ? res.data : item));
    setEditingId(null);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎯 Wishlist Tracker</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Link dell'articolo"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="border px-2 py-1 flex-grow min-w-[200px]"
          required
        />
        <input
          type="number"
          placeholder="Prezzo"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border px-2 py-1 w-24"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border px-2 py-1"
        >
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-1 rounded">Aggiungi</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">Prezzo</th>
            <th className="text-left p-2">Categoria</th>
            <th className="text-left p-2">Link</th>
            <th className="text-left p-2">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const cat = categories.find(c => c.name === item.category);

            if (editingId === item.id) {
              return (
                <tr key={item.id} className="border-t bg-yellow-50">
                  <td className="p-2">
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border px-1 py-0.5 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="border px-1 py-0.5 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="border px-1 py-0.5 w-full"
                    >
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={editForm.url}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      className="border px-1 py-0.5 w-full"
                    />
                  </td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEditSubmit(item.id)} className="text-green-600">💾</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500">✖</button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">€{item.price}</td>
                <td className="p-2">
                  <span className="px-2 py-1 rounded text-white" style={{ backgroundColor: cat?.color || "gray" }}>
                    {item.category}
                  </span>
                </td>
                <td className="p-2">
                  <a href={item.url} target="_blank" className="text-blue-500 underline" rel="noreferrer">
                    Vai
                  </a>
                </td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(item)}><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
