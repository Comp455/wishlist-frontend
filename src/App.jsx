
import React, { useState, useEffect } from "react";
import axios from "axios";

const categories = [
  { name: "Casa", color: "#f87171" },
  { name: "Svago", color: "#60a5fa" },
  { name: "Scrivania", color: "#34d399" },
  { name: "Libri", color: "#fbbf24" }
];

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ url: "", category: "Casa" });

  useEffect(() => {
    axios.get("https://wishlist-tracker-backend-wlvx.onrender.com/api/items").then((res) => {
      setItems(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("https://wishlist-backend-wlvx.onrender.com/api/items", form);
    setItems([...items, res.data]);
    setForm({ url: "", category: "Casa" });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎯 Wishlist Tracker</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Incolla il link dell'articolo"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="border px-2 py-1 mr-2 w-2/3"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border px-2 py-1 mr-2"
        >
          {categories.map((cat) => (
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
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const cat = categories.find((c) => c.name === item.category);
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
