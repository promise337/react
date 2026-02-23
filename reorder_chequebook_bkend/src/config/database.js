const oracledb = require('oracledb');

// Oracle DB connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60
};

let pool;

/**
 * Initialize database connection pool
 */
const initializePool = async () => {
  try {
    pool = await oracledb.createPool(dbConfig);
    console.log('====== Database connection pool initialized ======');
  } catch (error) {
    console.error('Failed to initialize database pool:', error);
    throw error;
  }
};

/**
 * Get database connection from pool
 */
const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Failed to get database connection:', error);
    throw error;
  }
};

/**
 * Close database connection pool
 */
const closePool = async () => {
  try {
    if (pool) {
      await pool.close(10);
      console.log('====== Database connection pool closed ======');
    }
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  initializePool,
  getConnection,
  closePool
};