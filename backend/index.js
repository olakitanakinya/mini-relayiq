const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS handovers (
    id SERIAL PRIMARY KEY,
    title TEXT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

app.get("/handovers", async (_, res) => {
  const { rows } = await pool.query("SELECT * FROM handovers ORDER BY created_at DESC");
  res.json(rows);
});

app.post("/handovers", async (req, res) => {
  const { title, details } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO handovers (title, details) VALUES ($1, $2) RETURNING *",
    [title, details]
  );
  res.json(rows[0]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

