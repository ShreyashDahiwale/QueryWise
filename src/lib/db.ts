import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mydb',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export const query = async (sql: string, params?: any[]) => {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
};

export default pool;