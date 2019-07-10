'use strict'

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');

const db = require('./db.js');
const controller = require('./controller.js');

const baseUrl = '/api/v1';

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api.yaml');
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Hae pelin tilanne
app.get(baseUrl + '/game/:id', async function (request, response) {
    console.log(request.params);
    try {
        const state = await db.getState(request.params.id);

        if (state) {
            response.status(200).send({
                score: state.score,
                player: state.player,
                dealer: state.dealer,
                active: state.active,
                resolve: state.resolve
            });
        } else {
            response.status(404).send();
        }
    } catch (e) {
        response.status(500).send(e);
    }
});

// Luo uusi peli
app.post(baseUrl + '/game', async (request, response) => {
    try {
        const newId = await db.newGame();           // lue uusi tyhjä peli
        let state = await db.getState(newId);     // hae sen tila
        state = controller.initialize(state);       // alusta 
        state = await db.setState(newId, state)        // talleta tietokantaan
        response.status(201).send({ id: newId });
    } catch (e) {
        console.log(e);
        response.status(500).send(e);
    }
});

// Käsittele pelitoiminnot
app.post(baseUrl + '/game/:id', async (request, response) => {
    const id = request.params.id;
    const action = request.body.action;

    try {
        let state = await db.getState(id);

        // jos peliä ei löydy, palauta virhe
        if (!state) {
            response.status(404).send();
        }

        switch (action) {
            case 'hit':
                state = controller.handleHit(state);
                break;
            case 'stand':
                state = controller.handleStand(state);
                break;
            case 'play':
                state = controller.handlePlay(state);
                break;
            case 'deal':
                state = controller.newDeal(state);
                break;
            default:
                response.status(400).send();
                return;
        }

        state = await db.setState(id, state);
        
        response.status(200).send({
            score: state.score,
            player: state.player,
            dealer: state.dealer,
            active: state.active,
            resolve: state.resolve
        });
    } catch (e) {
        response.status(500).send({ error: 'Database error' });
    }
});

app.listen(port, function () {
    console.log(`Server listening to port ${port}`);
});