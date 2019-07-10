const demo = {
    score: {
        dealer: 5,
        player: 3
    },
    dealer: {
        cards: [
            {
                suit: {
                    name: "hearts",
                    symbol: "❤"
                },
                value: 3,
                label: "3"
            },
            {
                suit: {
                    name: "hearts",
                    symbol: "❤"
                },
                value: 14,
                label: "A"
            }
        ]
    },
    player: {
        cards: [
            {
                suit: {
                    "name": "spades",
                    "symbol": "♠"
                },
                value: 5,
                label: "5"
            },
            {
                suit: {
                    "name": "spades",
                    "symbol": "♠"
                },
                value: 12,
                label: "Q"
            }
        ]
    },
    active: "dealer",
    resolve: null
}

module.exports = { state: demo };