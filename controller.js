function newDeck() {

    const deck = [];
    const suits = [
        { name: "hearts", symbol: "\u2665"},
        { name: "diamonds", symbol: "\u2666"},
        { name: "clubs", symbol: "\u2663"},
        { name: "spades", symbol: "\u2660"}
    ];

    const labels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

    for (let suit of suits) {
        for(let j = 2; j <= 14; j++){
            deck.push({
                suit: suit,
                value: j,
                label: labels[j - 2]
            });
        }
    }
    return deck;
}

function initialize(state){
    state.score = {
            player: 0,
            dealer: 0
    }
    console.log("State atm", state);
    return state;
}
function resolve(state) {
    const playerHandValue = handValue(state.player.cards);
    const dealerHandValue = handValue(state.dealer.cards);

    if(playerHandValue > 21) {
        state = endGame(state, 'dealer', 'You bust, dealer wins');
    }
    else if (playerHandValue === 21) {
        state = endGame(state, 'player', '21, You win!')
    }
    else if(dealerHandValue > 21) {
            state = endGame(state, 'player', 'Dealer busts, you win');
    }
    else if (state.active === 'dealer' && dealerHandValue >= playerHandValue) {
            state = endGame(state, 'dealer', 'Dealer wins')
    }
    return state;
}

function endGame(state, winner, message) {
    state.score[winner]++;
        state.active = null;
        state.resolve = {
            winner,
            message
        }
    return state;
}

function handValue(cards) {
    let value = 0;
    for(let i = 0; i < cards.length; i++) {
        value = value + cards[i].value;
    }
    return value;
}

function newDeal(state) {
    
    const deck = newDeck()
    state = {
        score: state.score,
        deck: deck,
        dealer: {
            cards: [nextCard(deck)]
        },
        player: {
            cards: [nextCard(deck)]
        },
        active: 'player', 
        resolve: null
    }
    return state;
}

function handleHit(state) {
    state.player.cards.push(nextCard(state.deck))
    return state
}
function handlePlay(state) {
    state.dealer.cards.push(nextCard(state.deck))
    return state
}

function handleStand(state){
    state.active = "dealer";
    return state;
}

function nextCard(deck) {
    const card = deck.splice(Math.floor(Math.random() * deck.length), 1)
    return card[0];
};

module.exports = { initialize, newDeal, handleHit, handleStand, handlePlay, resolve }