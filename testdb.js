const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString
});

async function test() {
    // const id = uuid();
    // storage[id] = {};
    const res = await pool.query('SELECT * FROM pelit');
    if (res.rows) {
        console.log(res.rows);
        return res.rows[0].id;
    } else {
        return null;
    }
}

try {
    test();
} catch (e) {
    console.log(e);
}