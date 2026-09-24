const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");

const jumpButton = document.getElementById("jumpButton");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restart = document.getElementById("restart");

let playerY = 0;
let velocity = 0;
let jumping = false;

let score = 0;
let gameRunning = true;

let obstacleSpeed = 5;

let obstacles = [];


/* =========================
   PULO
========================= */

function jump() {

    if (!jumping && gameRunning) {

        velocity = 14;

        jumping = true;
    }
}


/* Botão do celular */

jumpButton.addEventListener("touchstart", function(e) {

    e.preventDefault();

    jump();

});


/* Também funciona com clique */

jumpButton.addEventListener("click", jump);


/* Teclado para PC */

document.addEventListener("keydown", function(e) {

    if (
        e.code === "Space" ||
        e.code === "ArrowUp"
    ) {

        e.preventDefault();

        jump();
    }

});


/* =========================
   CRIAR OBSTÁCULO
========================= */

function createObstacle() {

    if (!gameRunning) return;

    const obstacle =
        document.createElement("div");

    obstacle.className = "obstacle";

    obstacle.style.left =
        game.offsetWidth + "px";

    game.appendChild(obstacle);

    obstacles.push({

        element: obstacle,

        x: game.offsetWidth

    });
}


/* =========================
   COLISÃO
========================= */

function collision(a, b) {

    const r1 =
        a.getBoundingClientRect();

    const r2 =
        b.getBoundingClientRect();

    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}


/* =========================
   GAME OVER
========================= */

function endGame() {

    gameRunning = false;

    finalScore.textContent =
        "SCORE: " + score;

    gameOver.style.display = "flex";
}


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (!gameRunning) return;


    /* Física */

    velocity -= 0.8;

    playerY += velocity;


    if (playerY <= 0) {

        playerY = 0;

        velocity = 0;

        jumping = false;
    }


    player.style.transform =
        `translateY(${-playerY}px)`;


    /* Obstáculos */

    for (
        let i = obstacles.length - 1;
        i >= 0;
        i--
    ) {

        const obstacle =
            obstacles[i];


        obstacle.x -= obstacleSpeed;


        obstacle.element.style.left =
            obstacle.x + "px";


        /* Colisão */

        if (
            collision(
                player,
                obstacle.element
            )
        ) {

            endGame();

            return;
        }


        /* Saiu da tela */

        if (obstacle.x < -60) {

            obstacle.element.remove();

            obstacles.splice(i, 1);

            score++;

            scoreText.textContent =
                "SCORE: " + score;


            /* Aumenta dificuldade */

            if (score % 5 === 0) {

                obstacleSpeed += 0.4;
            }
        }
    }


    requestAnimationFrame(gameLoop);
}


/* =========================
   GERAR OBSTÁCULOS
========================= */

function obstacleLoop() {

    if (!gameRunning) return;

    createObstacle();


    const delay =
        Math.random() * 900 + 800;


    setTimeout(
        obstacleLoop,
        delay
    );
}


/* =========================
   REINICIAR
========================= */

restart.addEventListener("click", function() {

    location.reload();

});


/* =========================
   INICIAR
========================= */

obstacleLoop();

gameLoop();
