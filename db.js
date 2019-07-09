const uuid = require('uuid/v1');
const { Pool } = require('pg');
const dbURL = DATABASE_URL=$(heroku config:get DATABASE_URL -a afternoon-taiga-73934) your_process;
const  connectionString = process.env.dbURL;
console.log('Connection:', connectionString);

const pool = new Pool({
    connectionString,
    ssl: true
});

//Anna pelin tila
async function getState(id) {
    
    try {
        const res = await pool.query('select data from pelit WHERE id=$1', [id]);
        if (!res.rowCount) {    //tuntematon id
            return;
        }
        return res.rows[0].data;
    } catch (e) {
        console.log(e.message);
        throw { error: 'Database error' };
    }
}

async function setState (id, state) {
    try {
        let res = await pool.query("UPDATE pelit SET data =$1 WHERE id =$2", [state, id]);
        if (!res.rowCount) {
            return;
        }
        return state
    }
    catch(e) {
        throw { error: 'Database error' };
    }
}

async function newGame() {
    const id = uuid();
    console.log("ID:  ", id);

    try {
        const res = await pool.query('INSERT INTO pelit (id, data) VALUES ($1, $2) RETURNING id', [id, {}]);
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