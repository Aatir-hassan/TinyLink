import express from "express";
import pool from "../db.js";
import { customAlphabet } from "nanoid";

const router = express.Router();

// Allowed characters for short code
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 6);

// Validate code format
function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Validate URL format
function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
}

// -------------------------------
// POST /api/links
// Create short link
// -------------------------------
router.post("/", async (req, res) => {
  const { target, code } = req.body;

  if (!target || !isValidUrl(target)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  let finalCode = code;

  // If custom code is provided
  if (finalCode) {
    if (!isValidCode(finalCode)) {
      return res.status(400).json({ error: "Invalid code format" });
    }

    const exists = await pool.query("SELECT 1 FROM links WHERE code=$1", [
      finalCode,
    ]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: "Code already exists" });
    }
  } else {
    // Auto generate 6-char code
    finalCode = nanoid();
  }

  try {
    await pool.query("INSERT INTO links (code, target) VALUES ($1, $2)", [
      finalCode,
      target,
    ]);

    const created = await pool.query(
      "SELECT code, target, clicks, created_at, last_clicked FROM links WHERE code=$1",
      [finalCode]
    );

    return res.status(201).json(created.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------
// GET /api/links
// List all links
// -------------------------------
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT code, target, clicks, created_at, last_clicked FROM links ORDER BY created_at DESC"
  );
  return res.json(result.rows);
});

// -------------------------------
// GET /api/links/:code
// Stats for one link
// -------------------------------
router.get("/:code", async (req, res) => {
  const code = req.params.code;

  const result = await pool.query(
    "SELECT code, target, clicks, created_at, last_clicked FROM links WHERE code=$1",
    [code]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json(result.rows[0]);
});

// -------------------------------
// DELETE /api/links/:code
// Delete a link
// -------------------------------
router.delete("/:code", async (req, res) => {
  const code = req.params.code;

  const result = await pool.query("DELETE FROM links WHERE code=$1", [code]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json({ ok: true });
});

// -------------------------------
// GET /:code (Redirect)
// Updates clicks + last_clicked
// -------------------------------
router.get("/r/:code", async (req, res) => {
  const { code } = req.params;

  try {
    // 1. Find the link
    const result = await pool.query(
      "SELECT target FROM links WHERE code=$1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Not found");
    }

    const target = result.rows[0].target;

    // 2. Update click count + timestamp
    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    // 3. Redirect to the target
    return res.redirect(302, target);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});


export default router;
