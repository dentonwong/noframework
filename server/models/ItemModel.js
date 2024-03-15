const {Pool} = require('pg');
require('dotenv').config()

const URI = process.env.PG_URI;

const pool = new Pool({
  connectionString: URI
});

const db = {};
const setupStr = 'CREATE TABLE IF NOT EXISTS Item( id SERIAL PRIMARY KEY, description text, price numeric, purchased boolean DEFAULT false)';
const setupStr2 = 'CREATE TABLE IF NOT EXISTS Users( id SERIAL PRIMARY KEY, username text, password text)';

db.query = (string, params, cb) => {
  console.log('query running');
  return pool.query(string, params, cb);
};

db.query(setupStr);
db.query(setupStr2);

module.exports = db; 
