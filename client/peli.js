console.log("Script loaded");


let gameId2 = localStorage.getItem("gameId");


function createCard(card) {
    const newCard = document.createElement('div');
    newCard.classList.add('card');

    const top = document.createElement('div');
    top.classList.add('card-top');
    top.textContent = card.label;

    const middle = document.createElement('div');
    middle.classList.add('card-middle');
    middle.textContent = card.suit.symbol;

    const bottom = document.createElement('div');
    bottom.classList.add('card-bottom');
    bottom.textContent = card.label;

    newCard.appendChild(top);
    newCard.appendChild(middle);
    newCard.appendChild(bottom);

    return newCard
}


async function handleHit() {
    console.log("hit")

    const state = await makeAction('hit');
    if (state.resolve) {
        gameOver(state.resolve);

    }
    //.getElementById('player-hand').appendChild(createCard())
}


async function handleStand() {
    console.log('stand')
    let state = await makeAction('stand');

    if (state.resolve) {
        gameOver(state.resolve);
    } else {
        handlePlay();
    }
}


const gameOver = (resolve) => {
    document.querySelector('#overlay').style.visibility = 'visible';
    document.querySelector('#gameover p').textContent = resolve.message;
}


const handlePlay = async () => {
    let state = await makeAction('play');

    if (!state.resolve) {
        setTimeout(handlePlay, 1000);
    } else {
        gameOver(state.resolve);
    }
};

function render(state) {
    console.log(state);

    const dealerHand = document.getElementById('dealer-hand');
    dealerHand.innerHTML = '';
    for (let i = 0; i < state.dealer.cards.length; i++) {
        dealerHand.appendChild(createCard(state.dealer.cards[i]));
    }

    const playerHand = document.getElementById('player-hand');
    playerHand.innerHTML = '';

    state.player.cards.forEach(kortti => {
        playerHand.appendChild(createCard(kortti));

    });
    document.querySelector('#player-score').textContent = state.score.player;
    document.querySelector('#dealer-score').textContent = state.score.dealer;
}
async function makeAction(action) {
    const path = '/api/v1/game/';
    let gameId = "901530b0-7d34-11e9-a199-895479664c37";
    if(localStorage.getItem("gameId") === null) {
        fetch(path, {
            method: "POST"
        })
        .then(res => res.json())
        .then(data => {
            gameId = data.id;
            console.log("USING ID", gameId);
            localStorage.setItem("gameId", gameId);
        })
    }
    else {
        gameId = localStorage.getItem("gameId");
        console.log("USING ID", gameId);
    }
    
    //http://localhost:3000/api/v1/game/test
    const url = path + gameId;
    const reqData = {
        action: action
    }

    let respData;

    try {
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(reqData)
    });

    if (!response.ok) {
    const error = new Error('Request failed, server responded:');
        error.status = response.status;
        throw(error);
    }

     respData = await response.json();
 } catch (error) {
    console.log(error);
 }


    console.log(action);
    render(respData);
    return respData;
}

document.getElementById('hit').onclick = handleHit;
document.getElementById('stand').addEventListener('click', handleStand);
document.querySelector('#gameover button').onclick = () => {
    document.getElementById('overlay').style.visibility = 'hidden';
    makeAction('deal');
};

makeAction('deal');