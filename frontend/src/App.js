import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/stats";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-sky-600 text-white flex items-center justify-center font-bold">
                T
              </div>
              <div>
                <h1 className="text-lg font-semibold">TinyLink</h1>
                <div className="text-xs text-gray-500">
                  Minimal URL shortener
                </div>
              </div>
            </Link>
            <nav>
              <Link
                to="/"
                className="text-sm text-slate-600 hover:text-sky-600"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<Stats />} />
          </Routes>
        </main>

        <footer className="text-center py-6 text-xs text-gray-400">
          Built for TinyLink assignment — {new Date().getFullYear()}
        </footer>
      </div>
    </BrowserRouter>
  );
}
