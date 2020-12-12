const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const audio = document.querySelector(".audio");

const scoreTable = document.querySelectorAll(".score-table");
const topTable = document.querySelectorAll(".top");

var localName = '';
var localScore = '';

var scoreMin = 0;
var nameMin = '-----';

var killSanta = false;


let lastHole;
let timeUp = false;
let score = 0;
var gameTime = 10000;
var minTime = 200;
var maxTime = 1000;

var user = [];
user[0] = {
    name: '',
    score: '0'
};


audio.play();

function stats() {
    if (localStorage.getItem('storedUsers')) {
        user = JSON.parse(localStorage.getItem('storedUsers'));
    }
    user.sort( function (a, b) {
        if (a.score > b.score) {
          return -1;
        }
        if (a.score < b.score) {
          return 1;
        }
        return 0;
      });
    
    for (var i = 0; i < 5; i++) {
        if (user[i] && user[i].score > 0) {
            scoreTable[i].textContent = user[i].score;
            topTable[i].textContent = user[i].name;
        } else {
            scoreTable[i].textContent = scoreMin;
            topTable[i].textContent = nameMin;
        }
    }
}



function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
      return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function randomImages () {
    const image = Math.floor(Math.random() * 100);
    if ( image <= 20) {
            document.querySelectorAll('.mole').forEach(function(elem){elem.style.background = "url('santa-claus.svg') bottom center no-repeat"})
            killSanta = true;
            console.log(killSanta);
    } else if ( image > 20) {
            document.querySelectorAll('.mole').forEach(function(elem){elem.style.background = "url('mole.svg') bottom center no-repeat"})
            killSanta = false;
            console.log(killSanta);
    }
}

function peep() {
    const time = randomTime(minTime, maxTime);
    const hole = randomHole(holes);
    hole.classList.add('up');
    randomImages ();
    setTimeout(() => {
      hole.classList.remove('up');
      if (!timeUp) peep();
    }, time);
}

function startGame() {
    const start = document.getElementById('start-bottom');
    const update = document.getElementById('update-bottom');
    const endGame = document.getElementById('end-bottom');
    start.classList.add("no-loaded");
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    randomImages ();
    peep();
    setTimeout( function() {
        update.classList.remove("no-loaded");
        endGame.classList.remove("no-loaded");
        timeUp = true;
    }, gameTime);
}

function startGameNext() {
    const update = document.getElementById('update-bottom');
    const endGame = document.getElementById('end-bottom');
    endGame.classList.add("no-loaded");
    update.classList.add("no-loaded");
    scoreBoard.textContent = score;
    timeUp = false;
    gameTime = 20000;
    minTime = 300;
    maxTime = 700;
    peep();
    setTimeout( function() {
        endGame.classList.remove("no-loaded");
        timeUp = true;
    }, gameTime);
}

function endGame () {
    const start = document.getElementById('start-bottom');
    const update = document.getElementById('update-bottom');
    const endGame = document.getElementById('end-bottom');
    start.classList.remove("no-loaded");
    update.classList.add("no-loaded");
    endGame.classList.add("no-loaded");
    const authorization = document.querySelector('.load-game1');
    const load = document.querySelector('.load-game');
    authorization.classList.remove("no-loaded");
    load.classList.add("no-loaded");
    updateLocal();
    stats()
}

function startGo() {
    const authorization = document.querySelector('.load-game1');
    const load = document.querySelector('.load-game');
    authorization.classList.add("no-loaded");
    load.classList.remove("no-loaded");
    localName = (document.getElementById ('yourName')).value;
    audio.play();
}

function bonk(e) {
    if(!e.isTrusted) return; // cheater!
    if (killSanta === false) {
        ++score;
        this.parentNode.classList.remove('up');
        scoreBoard.textContent = score;
        localScore = score;
    } else if (killSanta === true) {
        --score;
        this.parentNode.classList.remove('up');
        scoreBoard.textContent = score;
        localScore = score;
    }
    
}

function updateLocal() {
    if (localName != 'Your name' && localName != ''){
        var block = true;
        for (var i = 0; i < user.length; i++) {
            if ( user[i].name === localName) {
                if (user[i].score < localScore) {
                    user[i].score = localScore;
                }
                block = false;
                break;
            } 
        }
        if ( block === true) {
            user.push({name: localName, score: localScore});
        }
        localStorage.setItem('storedUsers', JSON.stringify(user));
    } else {
        return false;
    }
}


moles.forEach(mole => mole.addEventListener('click', bonk));
window.addEventListener('load', stats);

