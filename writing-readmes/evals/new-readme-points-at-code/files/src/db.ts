import { Pool } from 'pg';

const db = new Pool({ max: Number(process.env.DATABASE_POOL_SIZE ?? 10) });

export { db };
