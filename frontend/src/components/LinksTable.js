import React from "react";
import { Link } from "react-router-dom";

export default function LinksTable({ links, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm divide-y">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2">Code</th>
            <th className="px-3 py-2">Target</th>
            <th className="px-3 py-2">Clicks</th>
            <th className="px-3 py-2">Last clicked</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {links.map((l) => (
            <tr key={l.code}>
              <td className="px-3 py-2 font-medium">
                <Link to={`/code/${l.code}`} className="text-sky-600">
                  {l.code}
                </Link>
              </td>
              <td
                className="px-3 py-2 max-w-xs truncate-ellipsis"
                title={l.target}
              >
                <a
                  href={l.target}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-800"
                >
                  {l.target}
                </a>
              </td>
              <td className="px-3 py-2">{l.clicks}</td>
              <td className="px-3 py-2">
                {l.last_clicked
                  ? new Date(l.last_clicked).toLocaleString()
                  : "-"}
              </td>
              <td className="px-3 py-2 space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/${l.code}`
                    );
                    alert("Copied");
                  }}
                  className="px-2 py-1 border rounded text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() => onDelete(l.code)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
