const uuid = require('uuid/v1');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ventti';
console.log('Connection:', connectionString);

const pool = new Pool({
    connectionString
});

// dummy-tietokanta
// const storage = {
//     test: {
//         score: {
//             player: 0,
//             dealer: 0
//         }
//     }
// };

// anna pelin tila
async function getState(id) {
    //return storage[id];
    try {
        const res = await pool.query('select data from pelit WHERE id=$1', [id]);
        if (!res.rowCount) {    // tuntematon id
            return;
        }
        return JSON.parse(res.rows[0].data);
    } catch (e) {
        console.log(e.message);
        throw { error: 'Database error' };
    }
}

// talleta pelin tila
async function setState(id, state) {
    // if (storage[id]) {
    //     storage[id] = state;
    //     return state;
    // } else {
    //     return;
    // }
    try {
        const res = await pool.query("UPDATE pelit SET data=$2 WHERE id=$1", [id, state]);
        if (!res.rowCount) {    // tuntematon id
            return;
        }
        return state;
    } catch (e) {
        console.log(e.message);
        throw { error: 'Database error' };
    }
}

// luo uusi peli ja anna sen id
async function newGame() {
    const id = uuid();
    // storage[id] = {};
    try {
        const res = await pool.query(`INSERT INTO pelit (id, data) VALUES ($1, $2) RETURNING id`, [id, {}]);
        return res.rows[0].id;
    } catch (e) {
        console.log(e.message);
        throw { error: 'Database error' };
    }
}

module.exports = {
    getState: getState,
    setState: setState,
    newGame: newGame
}