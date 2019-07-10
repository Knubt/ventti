// apufunktio, luo uuden pakan
function newDeck() {
    const deck = [];
    const suits = [
        { name: "hearts", symbol: "\u2665" },
        { name: "diamonds", symbol: "\u2666" },
        { name: "clubs", symbol: "\u2663" },
        { name: "spades", symbol: "\u2660" }
    ];
    const labels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

    for (let suit of suits) {
        for (let j = 2; j <= 14; j++) {
            deck.push({
                suit: suit,
                value: j,
                label: labels[j - 2]
            });
        }
    }
    return deck;
}

// alusta uuden pelin tila
function initialize(state) {
    state = {
        score: {
            player: 0,
            dealer: 0
        }
    }
    return state;
}

// käsittele deal-toiminto
function newDeal(state) {
    const deck = newDeck();

    state.deck = deck;
    state.dealer = {
        cards: [nextCard(deck)]
    };
    state.player = {
        cards: [nextCard(deck)]
    };
    state.active = 'player';
    state.resolve = null

    return state;
}

// käsittele hit-toiminto
function handleHit(state) {
    if (state.active === 'player') {
        state.player.cards.push(nextCard(state.deck));
    }
    state = resolve(state);
    return state;
}

// käsittele stand-toiminto
function handleStand(state) {
    if (state.active === 'player') {
        state.active = 'dealer';
    }
    state = resolve(state);
    return state;
}

// käsittele play-toiminto
function handlePlay(state) {
    if (state.active === 'dealer') {
        state.dealer.cards.push(nextCard(state.deck));
    }
    state = resolve(state);
    return state;
}

// onko peli ratkennut?
function resolve(state) {
    const playerHandValue = handValue(state.player.cards);
    const dealerHandValue = handValue(state.dealer.cards);

    if (playerHandValue > 21) {
        state = endGame(state, 'dealer', 'You bust, dealer wins');
    } else if (playerHandValue === 21) {
        state = endGame(state, 'player', '21, you win!');
    } else if (dealerHandValue > 21) {
        state = endGame(state, 'player', 'Dealer busts, you win');
    } else if (dealerHandValue === 21) {
        state = endGame(state, 'dealer', '21, dealer wins');
    } else if (state.active === 'dealer' && dealerHandValue >= playerHandValue) {
        state = endGame(state, 'dealer', 'Dealer wins');
    }

    return state;
}

// apufunktio, päivitä ratkenneen pelin tila
function endGame(state, winner, message) {
    state.score[winner]++;
    state.active = null;
    state.resolve = {
        winner,
        message
    }
    return state;
}

// apufunktio, laske käden arvo
function handValue(cards) {
    let value = 0;
    let aces = 0;

    for (let i = 0; i < cards.length; i++) {
        value = value + cards[i].value;
        if (cards[i].label === 'A') {
            aces++;
        }
    }

    while (value > 21 && aces > 0) {
        value = value - 13;
        aces--;
    }

    return value;
}

// apufunktio, ota seuraava kortti pakasta
function nextCard(deck) {
    const card = deck.splice(Math.floor(Math.random() * deck.length), 1);
    return card[0];
}

module.exports = { initialize, newDeal, handleHit, handleStand, handlePlay }