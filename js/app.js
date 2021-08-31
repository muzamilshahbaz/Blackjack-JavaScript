let blackjackGame = {

    'you': {
        'scoreSpan': '#your-score',
        'div': '#your-box',
        'score': 0
    },
    'dealer': {
        'scoreSpan': '#dealer-score',
        'div': '#dealer-box',
        'score': 0
    },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],

    'cardsMap': {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'K': 10,
        'J': 10,
        'Q': 10,
        'A': [1, 11]
    },

    'wins': 0,
    'losses': 0,
    'draws': 0,

    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lostSound = new Audio('sounds/aww.mp3');
const drawSound = new Audio('sounds/draw.wav');
const bustSound = new Audio('sounds/bust.mp3');
const dealSound = new Audio('sounds/deal.wav');

document.querySelector('#blackjack-hit').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand').addEventListener('click', dealerLogic);




function blackjackHit() {

    if (blackjackGame['isStand'] == false) {

        let card = randomCard();
        showCard(YOU, card);
        updateScore(YOU, card);
        showScore(YOU);
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {

    if (blackjackGame['turnsOver'] == false) {

        blackjackGame['isStand'] = true;

        while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {

            let card = randomCard();
            showCard(DEALER, card);
            updateScore(DEALER, card);
            showScore(DEALER);
            await sleep(1000);
        }

        //   if (DEALER['score'] > 15) {

        blackjackGame['turnsOver'] = true;
        showResult(decideWinner());
        // }
    }
}

function blackjackDeal() {

    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');


        for (let i = 0; i < yourImages.length; i++) {

            yourImages[i].remove();
        }


        for (let i = 0; i < dealerImages.length; i++) {

            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        dealSound.play();

        document.querySelector('#your-score').textContent = 0;
        document.querySelector('#dealer-score').textContent = 0;

        document.querySelector('#your-score').style.color = 'white';
        document.querySelector('#dealer-score').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = "purple";

        blackjackGame['turnsOver'] = false;
    }


}



function showCard(activePlayer, card) {

    if (activePlayer['score'] <= 21) {

        let cardImg = document.createElement('img');
        cardImg.src = `images/${card}.png`;
        cardImg.width = 110;
        cardImg.height = 140;
        cardImg.style = 'padding: 10px';
        document.querySelector(activePlayer['div']).appendChild(cardImg);
        hitSound.play();
    }
}

function randomCard() {
    return blackjackGame['cards'][Math.floor(Math.random() * 13)];
}

function updateScore(activePlayer, card) {

    if (card == 'A') {

        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {

            activePlayer['score'] += blackjackGame['cardsMap'][card][1];

        } else {

            activePlayer['score'] += blackjackGame['cardsMap'][card][0];

        }

    } else {

        activePlayer['score'] += blackjackGame['cardsMap'][card];

    }

}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        bustSound.play();
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST !!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';

    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function decideWinner() {

    let winner;

    if (YOU['score'] <= 21) {

        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {

            blackjackGame['wins']++;
            console.log('You won!!');
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {

            blackjackGame['losses']++;
            console.log('You lost!!');
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {

            blackjackGame['draws']++;
            console.log('You Drew!!');
        }

    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {

        blackjackGame['losses']++;
        console.log('You lost!!');
        winner = DEALER;

    } else if (YOU['score'] > 21 && DEALER['score']) {

        blackjackGame['draws']++;
        console.log('You Drew!!');
    }

    console.log('Winner is ', winner);

    return winner;
}

function showResult(winner) {

    let message, messageColor;

    if (blackjackGame['turnsOver'] == true) {

        if (winner == YOU) {

            message = 'You Won!!';
            messageColor = 'green';
            winSound.play();

        } else if (winner == DEALER) {

            message = 'You Lost!!';
            messageColor = 'red';
            lostSound.play();

        } else {

            message = 'You Drew!!';
            messageColor = 'blue';
            drawSound.play();

        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
        document.getElementById('blackjack-wins').innerText = blackjackGame['wins'];
        document.getElementById('blackjack-losses').innerText = blackjackGame['losses'];
        document.getElementById('blackjack-draws').innerText = blackjackGame['draws'];
    }

}