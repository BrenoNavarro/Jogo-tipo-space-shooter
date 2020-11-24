const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;
let score = 0;
let highscore = 0;

// Movimento e ação
function flyShip(event) {
    if (event.key === "ArrowUp") {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

// Subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (parseInt(topPosition) <= 0) {
        let position = parseInt(topPosition);
        position += 25;
        yourShip.style.top = `${position}px`;
    } else {
        let position = parseInt(topPosition);
        position -= 25;
        yourShip.style.top = `${position}px`;
    }
}

// Descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (parseInt(topPosition) >= 730) {
        let position = parseInt(topPosition);
        position -= 25;
        yourShip.style.top = `${position}px`;
    } else {
        let position = parseInt(topPosition);
        position += 25;
        yourShip.style.top = `${position}px`;
    }
}

// Tiro
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}



function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => {
            if (checkLaserCollision(laser, alien)) {
                score++;
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        });

        if (xPosition >= 750) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 16}px`;
        }
    }, 10);
}

// Criar os inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; // Sorteio do alien
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '75%';
    newAlien.style.top = `${Math.floor(Math.random()*710)+30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}


// Movimento dos inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if (xPosition <= 50) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                document.getElementById('main-play-area').style.backgroundImage = "url(/img/game-over.jpg)";
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 20)
}

// Colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if (laserLeft != 750 && laserLeft + 40 >= alienLeft) {
        if (laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//Inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    score = 0;
    document.getElementById('main-play-area').style.backgroundImage = "url(/img/space.png)";
    startButton.style.display = 'none';
    instructionText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2500);
}

//Fim de jogo
function gameOver() {
    if (highscore < score) {
        highscore = score;
    }
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert(`Game Over!\nSua pontuação: ${score}\nPontuação máxima: ${highscore}`);
        yourShip.style.top = '250px';
        startButton.style.display = 'block';
        instructionText.style.display = 'block';
    }, 100)
}