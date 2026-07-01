import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const trustServerCertificate =
  process.env.DB_TRUST_SERVER_CERT === 'true' ||
  process.env.DB_TRUST_SERVER_CERTIFICATE === 'true';

const dbConfig = {
  user: process.env.DB_USER || process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate 
  }
};

async function connectDB() {
  try {
    if (!dbConfig.user || !dbConfig.password || !dbConfig.server || !dbConfig.database) {
      throw new Error('Missing DB_USER or DB_USERNAME, DB_PASSWORD or DB_PASS, DB_SERVER, or DB_NAME in .env');
    }

    await sql.connect(dbConfig);
    console.log('Connected to SQL Server');
  } catch (error: any) {
    console.error('Database connection failed:', error.message);
  }
}

export { sql, connectDB };