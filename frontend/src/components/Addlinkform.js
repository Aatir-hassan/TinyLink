import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

function validateUrl(v) {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function AddLinkForm({ onCreate }) {
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!target || !validateUrl(target)) return setErr('Enter a valid URL (http/https).');
    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) return setErr('Custom code must be 6–8 alphanumeric characters.');

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, code: code || undefined }),
      });

      if (res.status === 409) throw new Error('Code already exists');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Create failed');
      }

      const data = await res.json();
      onCreate(data);
      setTarget('');
      setCode('');
      alert(`Created short code: ${data.code}`);
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-600">Long URL</label>
          <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="https://example.com/..." className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="text-xs text-gray-600">Custom code (opt.)</label>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="abc123" className="mt-1 w-full border px-3 py-2 rounded" />
        </div>
      </div>

      {err && <div className="mt-2 text-sm text-red-600">{err}</div>}

      <div className="mt-3 flex items-center gap-2">
        <button disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded">
          {loading ? 'Creating…' : 'Create Short Link'}
        </button>
        <div className="text-sm text-gray-500">Codes: 6–8 letters/numbers</div>
      </div>
    </form>
  );
}
