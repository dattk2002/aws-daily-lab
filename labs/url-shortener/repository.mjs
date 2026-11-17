export function createRepository(pool) {
  return {
    async ping() { await pool.query('SELECT 1'); },
    async create(code, url) {
      const result = await pool.query('INSERT INTO links (code, url) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING', [code, url]);
      return result.rowCount === 1;
    },
    async find(code) {
      const result = await pool.query('SELECT url FROM links WHERE code = $1', [code]);
      return result.rows[0]?.url ?? null;
    },
  };
}
