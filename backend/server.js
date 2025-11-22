import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import pool from "./db.js";
import linksRouter from "./routes/links.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

// API routes
app.use("/api/links", linksRouter);

// -------------------------------
// GET /:code → Redirect
// -------------------------------
app.get("/:code", async (req, res) => {
  const code = req.params.code;

  // Code must match allowed pattern
  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return res.status(404).send("Not found");
  }

  const result = await pool.query("SELECT target FROM links WHERE code=$1", [code]);

  if (result.rows.length === 0) {
    return res.status(404).send("Not found");
  }

  const target = result.rows[0].target;

  // Update clicks
  await pool.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );

  return res.redirect(302, target);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
