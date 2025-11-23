import React, { useEffect, useState } from "react";
import AddLinkForm from "../components/Addlinkform";
import LinksTable from "../components/LinksTable";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLinks() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/links`);
;
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load links");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  function onCreate(newLink) {
    setLinks((prev) => [newLink, ...prev]);
  }

  async function handleDelete(code) {
    if (!window.confirm(`Delete ${code}?`)) return;
      // const res = await fetch(`${API_BASE}/api/links/${code}`, {
      
        const res = await fetch(`${API_BASE}/api/links/${code}`,{
      method: "DELETE",
    });
    if (res.ok) {
      setLinks((prev) => prev.filter((l) => l.code !== code));
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error || "Delete failed");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <AddLinkForm onCreate={onCreate} />
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div className="text-sm text-gray-500">Loading links…</div>
        ) : links.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No links yet — create one above.
          </div>
        ) : (
          <LinksTable links={links} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
