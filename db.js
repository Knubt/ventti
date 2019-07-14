const uuid = require('uuid/v1');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://cuhivfcdndutkq:2d53d780480b6c8823ec069c0a66ea8713e541c981952f9d6e74475b50343ad9@ec2-174-129-229-106.compute-1.amazonaws.com:5432/dfo3oq85ku6g4k';

//const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:@localhost:5432/ventti';


console.log('Connection:', connectionString);

const pool = new Pool({
    connectionString
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