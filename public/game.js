import { sendAction, getNewGame, getCurrentGame } from './api.js';
import { render, setGameOverOnOk } from './view.js';

let gameId;

async function startGame() {
    gameId = window.localStorage.getItem('id');

    // check existing game
    if (gameId) {
        console.log('Continue game:', gameId);
        const state = await getCurrentGame(gameId);
        console.log(state);
        if (state) { // game found on server
            render(state);
            return gameId;
        }
    }

    // start new game
    const newGame = await getNewGame();
    if (!newGame) {
        return;
    } else {
        gameId = newGame.id;
        window.localStorage.setItem('id', gameId);
        console.log('New game:', newGame.id);
        makeAction('deal');
        return gameId;
    }
}

async function handleHit() {
    console.log("Hit");

    const state = await makeAction('hit');
}

async function handleStand() {
    console.log('Stand');
    let state = await makeAction('stand');

    if (!state.resolve) {
        handlePlay();
    } else {
        gameOver(state.resolve);
    }
}

const handlePlay = async () => {
    let state = await makeAction('play');

    if (!state.resolve) {
        setTimeout(handlePlay, 1000);
    }
};

const makeAction = async (action) => {
    const state = await sendAction(gameId, action);
    render(state);
    return state;
};

document.getElementById('hit').onclick = handleHit;
document.getElementById('stand').addEventListener('click', handleStand);

setGameOverOnOk(() => {
    makeAction('deal');
});

document.querySelector('#end-game').onclick = () => {
    window.localStorage.clear();
    startGame();
}

startGame();



