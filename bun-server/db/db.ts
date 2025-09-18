
import { Pool } from "pg";

export const pool = new Pool({
  host: "db",            
  user: "postgre",
  password: "postgre",
  database: "taskdb",
  port: 5432,
});

//runs migration
pool.on('connect', async () => {
    const fs = await import('fs');
    const sql = fs.readFileSync('./db/migration.sql', 'utf8');
    await pool.query(sql);
    console.log(' Database tables created!');
  });
