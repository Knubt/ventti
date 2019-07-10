let gameoverOnOk;

function render(state) {
    if (!state || !state.dealer || !state.player) {
        return;
    }

    const dealerHand = document.getElementById('dealer-hand');
    dealerHand.innerHTML = '';
    state.dealer.cards.forEach(element => {
        dealerHand.appendChild(createCard(element));
    });

    const playerHand = document.getElementById('player-hand');
    playerHand.innerHTML = '';
    state.player.cards.forEach(element => {
        playerHand.appendChild(createCard(element));
    });

    document.getElementById('player-score').innerHTML = state.score.player;
    document.getElementById('dealer-score').innerHTML = state.score.dealer;

    if (state.resolve) {
        setTimeout(() => {
            document.querySelector('#overlay').style.visibility = 'visible';
            document.querySelector('#gameover p').textContent = state.resolve.message;
            document.querySelector('#gameover button').onclick = renderGameoverOk;
        }, 1000);
    }
}

function setGameOverOnOk(callback) {
    gameoverOnOk = callback;
}

function createCard(card) {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    // <div class="card">
    //     <div class="card-top">A</div>
    //     <div class="card-middle">&spades;</div>
    //     <div class="card-bottom">A</div>
    // </div>

    const top = document.createElement('div');
    top.classList.add('card-top');
    top.textContent = card.label;

    const middle = document.createElement('div');
    middle.classList.add('card-middle', card.suit.name);
    middle.innerHTML = card.suit.symbol;

    const bottom = document.createElement('div');
    bottom.classList.add('card-bottom');
    bottom.textContent = card.label;

    newCard.appendChild(top);
    newCard.appendChild(middle);
    newCard.appendChild(bottom);

    return newCard;
}

const renderGameoverOk = () => {
    document.getElementById('overlay').style.visibility = 'hidden';
    gameoverOnOk();
};

export { render, setGameOverOnOk };