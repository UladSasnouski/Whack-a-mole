const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const top1 = document.getElementById('top1');
const top2 = document.getElementById('top2');
const top3 = document.getElementById('top3');
const top4 = document.getElementById('top4');
const top5 = document.getElementById('top5');
const audio = document.querySelector(".audio");

const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const score3 = document.getElementById('score3');
const score4 = document.getElementById('score4');
const score5 = document.getElementById('score5');

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
    
    if (user[0].score > 0 && typeof user[0].score != "undefined") {
        score1.textContent = user[0].score;
        top1.textContent = user[0].name;
    } else {
        score1.textContent = scoreMin;
        top1.textContent = nameMin;
    }
    if (user[1].score > 0  && typeof user[1].score != "undefined") {
        score2.textContent = user[1].score;
        top2.textContent = user[1].name;
    } else {
        score2.textContent = scoreMin;
        top2.textContent = nameMin;
    }
    if (user[2].score > 0  && typeof user[2].score != "undefined") {
        score3.textContent = user[2].score;
        top3.textContent = user[2].name;
    } else {
        score3.textContent = scoreMin;
        top3.textContent = nameMin;
    }
    if (user[3].score > 0  && typeof user[3].score != "undefined") {
        score4.textContent = user[3].score;
        top4.textContent = user[3].name;
    } else {
        score4.textContent = scoreMin;
        top4.textContent = nameMin;
    }
    if (user[4].score > 0  && typeof user[4].score != "undefined") {
        score5.textContent = user[4].score;
        top5.textContent = user[4].name;
    } else {
        score5.textContent = scoreMin;
        top5.textContent = nameMin;
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
}

function bonk(e) {
    if(!e.isTrusted) return; // cheater!
    if (killSanta === false) {
        score++;
        this.parentNode.classList.remove('up');
        scoreBoard.textContent = score;
        localScore = score;
    } else if (killSanta === true) {
        score--;
        this.parentNode.classList.remove('up');
        scoreBoard.textContent = score;
        localScore = score;
    }
    
}

function updateLocal() {
    if (localName != 'Your name'){
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

