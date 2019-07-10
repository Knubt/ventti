const express = require("express")
const app = express()
const port = process.env.PORT || 3000;


const baseUrl = '/api/v1';

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('client'));

//const state = await dp.getState(request.params.id);

const db = require('./db.js');

const controller = require('./controller.js');

app.get(baseUrl + '/game/:id', async function (request, response) {
    console.log(request.params);

    try{
        const state = await db.getState(request.params.id);

        if (state) {
            response.status(200).send({
                scorer: state.score,
                player: state.player,
                dealer: state.dealer,
                active: state.active,
                resole: state.resolve
            });
        } else {
            response.status(404).send({ error: 'Unknown game id' });
        }
    } catch (e) {
        console.log(e.message)
        response.status(500).send(e);
    }
});

app.post(baseUrl + '/game', async (request, response) => {
    const newId = await db.newGame();
    let state = await db.getState(newId);
    state = controller.initialize(state);
    await db.setState(newId,state)
    //const newId = { id: 'test' }
    response.status(201).send({id: newId})
});

app.post(baseUrl + '/game/:id', async (request, response) => {
    const id = request.params.id;
    const action = request.body.action;

    let state = await db.getState(id);

    //Jos peliä ei löydy = virhe
    if(!state) {
        response.status(404).send();
    }
    console.log(state.score);
    switch (action) {
        case 'hit':
            state = controller.handleHit(state);
            state = controller.resolve(state);
            break;
        case 'stand':
            state = controller.handleStand(state);
            state = controller.resolve(state);
            break;
        case 'play':
            state = controller.handlePlay(state);
            state = controller.resolve(state);
            break;
        case 'deal':
            console.log("deal");
            state = controller.newDeal(state);
            state = controller.resolve(state);
            break;
        default:
            response.status(400).send()
    }

    await db.setState(id, state);
    response.status(200).send(state);

})

app.listen(port, function () {
    console.log(`Server listening to port ${port}`);
});
