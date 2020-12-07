const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const top1 = document.getElementById('top1');
const top2 = document.getElementById('top2');
const top3 = document.getElementById('top3');
const top4 = document.getElementById('top4');
const top5 = document.getElementById('top5');
var newUser = document.getElementById('newUser');

const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const score3 = document.getElementById('score3');
const score4 = document.getElementById('score4');
const score5 = document.getElementById('score5');

var localName = '';
var localScore = '';

var maxFirst = 0;
var maxSecond = 0;
var maxThird = 0;
var maxFourth = 0;
var maxFifth = 0;

var maxFirstName = '-----';
var maxSecondName = '-----';
var maxThirdName = '-----';
var maxFourthName = '-----';
var maxFifthName = '-----';

let lastHole;
let timeUp = false;
let score = 0;
var user = [];
user[0] = {};

function stats() {
    if (localStorage.getItem('storedUsers')) {
        user = JSON.parse(localStorage.getItem('storedUsers'));
    }
    console.log (user);

    for(var i = 0; i < user.length; i++) {
        if(user[i].score > maxFirst) {
            maxFirst = user[i].score;
            maxFirstName = user[i].name;
            console.log (maxFirst);
        }
    }
    for(var i = 0; i < user.length; i++) {
        if (user[i].score > maxSecond && user[i].score < maxFirst) {
            maxSecond = user[i].score;
            maxSecondName = user[i].name;
            console.log (maxSecond);
        }
    }
    for(var i = 0; i < user.length; i++) {
        if (user[i].score > maxThird && user[i].score < maxSecond) {
            maxThird = user[i].score;
            maxThirdName = user[i].name;
            console.log (maxThird);
        }
    }
    for(var i = 0; i < user.length; i++) {
        if (user[i].score > maxFourth && user[i].score < maxThird) {
            maxFourth = user[i].score;
            maxFourthName = user[i].name;
            console.log (maxFourth);
        }
    }
    for(var i = 0; i < user.length; i++) {
        if (user[i].score > maxFifth && user[i].score < maxFourth) {
            maxFifth = user[i].score;
            maxFifthName = user[i].name;
            console.log (maxFifth);
        }
    }

    score1.textContent = maxFirst;
    score2.textContent = maxSecond;
    score3.textContent = maxThird;
    score4.textContent = maxFourth;
    score5.textContent = maxFifth;

    top1.textContent = maxFirstName;
    top2.textContent = maxSecondName;
    top3.textContent = maxThirdName;
    top4.textContent = maxFourthName;
    top5.textContent = maxFifthName;
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

function peep() {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
      hole.classList.remove('up');
      if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    peep();
    setTimeout(() => timeUp = true, 10000);
}

function startGo() {
    const authorization = document.querySelector('.load-game1');
    const load = document.querySelector('.load-game');
    authorization.classList.add("no-loaded");
    load.classList.remove("no-loaded");
    localName = (document.getElementById ('yourName')).value;
    console.log(localName);
}

function bonk(e) {
    if(!e.isTrusted) return; // cheater!
    score++;
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
    localScore = score;
}

function updateLocal() {
    if (newUser.checked === true) {
        for (var i = 0; i <= user.length; i++) {
            if ( i === user.length) {
                user.push({name: localName, score: localScore, id: i++});
            }
        }
        localStorage.setItem('storedUsers', JSON.stringify(user));
    } else if (newUser.checked === false) {
        for (var i = 0; i <= user.length; i++) {
            if (user[i].name == localName) {
                user[i] = {
                    name: localName,
                    score: localScore
                }
            }
        }
        localStorage.setItem('storedUsers', JSON.stringify(user));
    }
}

moles.forEach(mole => mole.addEventListener('click', bonk));
window.addEventListener('load', stats);