import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/links/${code}`);
      if (res.status === 404) {
        setLink(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLink(data);
      setLoading(false);
    }
    load();
  }, [code]);

  if (loading) return <div>Loading…</div>;
  if (!link) return <div className="text-red-600">Link not found</div>;

  // IMPORTANT: short URL must point to BACKEND, not frontend
  const shortUrl = `${API_BASE}/${link.code}`;

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">
            Stats for <span className="text-sky-600">{link.code}</span>
          </h2>
          <div className="text-sm text-gray-500">
            Target:{" "}
            <a
              href={link.target}
              target="_blank"
              rel="noreferrer"
              className="text-sky-600"
            >
              {link.target}
            </a>
          </div>
        </div>
        <div className="text-sm text-right">
          <div className="font-medium">{link.clicks}</div>
          <div className="text-gray-500">total clicks</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500">Created</div>
          <div>{new Date(link.created_at).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Last clicked</div>
          <div>
            {link.last_clicked
              ? new Date(link.last_clicked).toLocaleString()
              : "-"}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(shortUrl);
            alert("Copied");
          }}
          className="px-3 py-2 bg-sky-600 text-white rounded"
        >
          Copy short URL
        </button>

        {/* FIXED — open target via backend short URL */}
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 border rounded text-sky-600"
        >
          Open target
        </a>

        <Link to="/" className="text-sm text-gray-500 self-center">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
