let gamePaused = false

// ==================================================
// CANVAS
// ==================================================

const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");


// ==================================================
// TECLAS
// ==================================================

let keys = {};


document.addEventListener("keydown", function(event) {

    keys[event.key] = true;

});


document.addEventListener("keyup", function(event) {

    keys[event.key] = false;

});


// ==================================================
// PLAYER
// ==================================================

const player = {

    x: 80,

    y: 250,

    width: 50,

    height: 30,

    speed: 5,

    hp: 3,

    maxHp: 3,

    level: 1

};

let bulletDamage = 1;

let doubleShot = false;

player.maxHp = 3;

// ==================================================
// BOSS
// ==================================================

let boss = null;

let bossActive = false;

let bossNumber = 1;

let bossSpawnLevel = 3 * bossNumber;

let bossMaxHp = 100 * bossNumber;

// ==================================================
// TIROS
// ==================================================

let bullets = [];


// ==================================================
// INIMIGOS
// ==================================================

let enemies = [];


// ==================================================
// PONTUAÇÃO
// ==================================================

let score = 0;


// ==================================================
// TIRO AUTOMÁTICO
// ==================================================

let shootCooldown = 0;

let shootDelay = 20;

// ==================================================
// TIMER
// ==================================================

let tempo = 0;


const timer = setInterval(() => {
  
  tempo++;

  if (tempoRestante < 0) {
    clearInterval(timer);
    alert("Tempo esgotado!");
  }
}, 1000);

// ==================================================
// CARDS
// ==================================================

const cards = [

    {
        name: "Canhão Pesado",
        description: "+1 de dano por tiro",

        apply: function() {
            bulletDamage ++;
        }
    },

    {
        name: "Cadência Acelerada",
        description: "Atira mais rapidamente",

        apply: function() {

            shootDelay -= 4;

            if (shootDelay < 4) {
                shootDelay = 4;
            }

        }
    },

    {
        name: "Blindagem",
        description: "+1 de vida máxima",

        apply: function() {
            player.maxHp += 1;
            player.hp += 1;
        }
    },

    {
        name: "Projétil Duplo",
        description: "Dispara dois projéteis",

        apply: function() {
            doubleShot = true;
        }
    }

];

// ==================================================
// CRIAR CARTAS
// ==================================================

function openCards() {

    let availableCards = [...cards];

    let selectedCards = [];

    for (let i = 0; i < 3; i++) {

        let random =
            Math.floor(
                Math.random() * availableCards.length
            );

        selectedCards.push(
            availableCards[random]
        );

        availableCards.splice(random, 1);
    }

    showCards(selectedCards);
}

function showCards(selectedCards) {

    gamePaused = true;

    const cardScreen =
        document.getElementById("cardScreen");

    const cardsContainer =
        document.getElementById("cards");

    cardsContainer.innerHTML = "";

    cardScreen.style.display = "block";


    selectedCards.forEach(function(card) {

        const element =
            document.createElement("div");

        element.className = "card";


        element.innerHTML = `

            <h2>${card.name}</h2>

            <p>${card.description}</p>

            <button>ESCOLHER</button>

        `;


        element.querySelector("button")
            .addEventListener("click", function() {

                card.apply();

                cardScreen.style.display = "none";

                gamePaused = false;

            });


        cardsContainer.appendChild(element);

    });

}

// ==================================================
// CRIAR TIRO
// ==================================================

function shoot() {

    let bullet = {

        x: player.x + player.width,

        y: player.y + player.height / 2 - 2,

        width: 12,

        height: 4,

        speed: 8

    };


    bullets.push(bullet);

}


// ==================================================
// ATUALIZAR TIROS
// ==================================================

function updateBullets() {


    // Diminuir cooldown

    if (shootCooldown > 0) {

        shootCooldown--;

    }


    // Atirar automaticamente

    if (shootCooldown <= 0) {

        shoot();

        shootCooldown = shootDelay;

    }


    // Mover tiros

    for (let bullet of bullets) {

        bullet.x += bullet.speed;

    }


    // Remover tiros fora da tela

    bullets = bullets.filter(function(bullet) {

        return bullet.x < canvas.width;

    });

}


// ==================================================
// DESENHAR TIROS
// ==================================================

function drawBullets() {

    ctx.fillStyle = "yellow";


    for (let bullet of bullets) {

        ctx.fillRect(

            bullet.x,

            bullet.y,

            bullet.width,

            bullet.height

        );

    }

}


// ==================================================
// CRIAR INIMIGO
// ==================================================

function spawnEnemy() {

    let enemy = {

        x: canvas.width + 20,

        y: Math.random() *
          (canvas.height - 40),

        width: 40,

        height: 30,

        speed: 2,

        hp: 1 + Math.floor(tempo / 20)

    };


    enemies.push(enemy);

}


// ==================================================
// TEMPORIZADOR DOS INIMIGOS
// ==================================================

let enemyTimer = 0;

let enemyDelay = 80;


// ==================================================
// ATUALIZAR INIMIGOS
// ==================================================

function updateEnemies() {


    // Criar novos inimigos
    
    if (enemyDelay >= 50) {
        enemyDelay -= Math.floor(tempo / 50);
    }

    if (bossActive) {
        
    } else {
        enemyTimer --;
    }
    
    if (enemyTimer <= 0) {

        spawnEnemy();

        enemyTimer = enemyDelay;

    }


    // Mover inimigos

    for (let enemy of enemies) {

        enemy.x -= enemy.speed;

    }


    // Remover inimigos que saíram

    enemies = enemies.filter(function(enemy) {

        return enemy.x + enemy.width > 0;

    });

}


// ==================================================
// DESENHAR INIMIGOS
// ==================================================

function drawEnemies() {

    ctx.fillStyle = "red";


    for (let enemy of enemies) {


        ctx.beginPath();


        ctx.moveTo(

            enemy.x + enemy.width,

            enemy.y + enemy.height / 2

        );


        ctx.lineTo(

            enemy.x,

            enemy.y

        );


        ctx.lineTo(

            enemy.x,

            enemy.y + enemy.height

        );


        ctx.closePath();


        ctx.fill();

    }

}


// ==================================================
// COLISÃO
// ==================================================

function collision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


// ==================================================
// COLISÃO TIRO x INIMIGO
// ==================================================

function checkBulletCollisions() {


    for (let i = bullets.length - 1; i >= 0; i--) {


        for (let j = enemies.length - 1; j >= 0; j--) {


            if (
                collision(
                    bullets[i],
                    enemies[j]
                )
            ) {


                // Dano

                enemies[j].hp = enemies[j].hp - bulletDamage;


                // Remover tiro

                bullets.splice(i, 1);


                // Inimigo morreu

                if (enemies[j].hp <= 0) {

                    enemies.splice(j, 1);

                    score += 10;

                }


                break;

            }

        }

    }

}


// ==================================================
// COLISÃO PLAYER x INIMIGO
// ==================================================

function checkPlayerCollisions() {


    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {


        if (
            collision(
                player,
                enemies[i]
            )
        ) {


            // Perde vida

            player.hp--;


            // Remove inimigo

            enemies.splice(i, 1);


            // Game Over

            if (player.hp <= 0) {

                player.hp = 0;

                gamePaused = true;

            }

        }

    }

}

// ==================================================
// COLISÃO TIRO x BOSS
// ==================================================

function checkBossCollisions() {

    if (!bossActive || boss === null) {
        return;
    }


    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        if (
            collision(
                bullets[i],
                boss
            )
        ) {

            boss.hp -= bulletDamage;

            bullets.splice(i, 1);

            if (boss.hp <= 0) {
                
            }

            // -------------------------
            // BOSS DERROTADO
            // -------------------------

            if (boss.hp <= 0) {

                boss.hp = 0;

                bossActive = false;

                boss = null;

                score += 100;

                bossNumber ++;

            }

        }

    }

}


// ==================================================
// ATUALIZAR PLAYER
// ==================================================

function updatePlayer() {


    // Subir

    if (
        keys["ArrowUp"] ||
        keys["w"] ||
        keys["W"]
    ) {

        player.y -= player.speed;

    }


    // Descer

    if (
        keys["ArrowDown"] ||
        keys["s"] ||
        keys["S"]
    ) {

        player.y += player.speed;

    }


    // Limite superior

    if (player.y < 0) {

        player.y = 0;

    }


    // Limite inferior

    if (
        player.y + player.height >
        canvas.height
    ) {

        player.y =
            canvas.height - player.height;

    }

}


// ==================================================
// DESENHAR PLAYER
// ==================================================

function drawPlayer() {

    ctx.fillStyle = "cyan";


    ctx.beginPath();


    ctx.moveTo(

        player.x,

        player.y

    );


    ctx.lineTo(

        player.x,

        player.y + player.height

    );


    ctx.lineTo(

        player.x + player.width,

        player.y + player.height / 2

    );


    ctx.closePath();


    ctx.fill();

}

// ==================================================
// CRIAR BOSS
// ==================================================

function spawnBoss() {

    if (bossActive || player.level < bossSpawnLevel) {
        return;
    }

    boss = {

        x: canvas.width + 100,

        y: canvas.height / 2 - 60,

        width: 100,

        height: 120,

        speed: 2,

        hp: bossMaxHp,

        maxHp: bossMaxHp,

        direction: 1,

        targetX: canvas.width - 180

    };

    bossActive = true;

}

// ==================================================
// ATUALIZAR BOSS
// ==================================================

function updateBoss() {

    if (!bossActive || boss === null) {
        return;
    }


    // -------------------------
    // ENTRADA DO BOSS
    // -------------------------

    if (boss.x > boss.targetX) {

        boss.x -= boss.speed;

        return;

    }


    // -------------------------
    // MOVIMENTO VERTICAL
    // -------------------------

    boss.y += boss.speed * boss.direction;


    // Limite superior

    if (boss.y <= 50) {

        boss.y = 50;

        boss.direction = 1;

    }


    // Limite inferior

    if (
        boss.y + boss.height >=
        canvas.height - 50
    ) {

        boss.y =
            canvas.height -
            boss.height -
            50;

        boss.direction = -1;

    }

}

// ==================================================
// DESENHAR BOSS
// ==================================================

function drawBoss() {

    if (!bossActive || boss === null) {
        return;
    }


    // Corpo

    ctx.fillStyle = "purple";

    ctx.fillRect(

        boss.x,

        boss.y,

        boss.width,

        boss.height

    );


    // Parte interna

    ctx.fillStyle = "black";

    ctx.fillRect(

        boss.x + 15,

        boss.y + 15,

        boss.width - 30,

        boss.height - 30

    );


    // Núcleo

    ctx.fillStyle = "red";

    ctx.fillRect(

        boss.x + 35,

        boss.y + 45,

        30,

        30

    );


    // -------------------------
    // BARRA DE VIDA
    // -------------------------

    const barWidth = 250;

    const barHeight = 18;

    const barX =
        canvas.width / 2 -
        barWidth / 2;

    const barY = 20;


    // Fundo

    ctx.fillStyle = "black";

    ctx.fillRect(

        barX,

        barY,

        barWidth,

        barHeight

    );


    // Vida

    ctx.fillStyle = "red";

    ctx.fillRect(

        barX,

        barY,

        barWidth *
        (boss.hp / boss.maxHp),

        barHeight

    );


    // Texto

    ctx.fillStyle = "white";

    ctx.font = "16px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        "BOSS",

        canvas.width / 2,

        barY + 14

    );

    ctx.textAlign = "left";

}

// ==================================================
// FUNDO
// ==================================================

function drawBackground() {

    ctx.fillStyle = "#080818";


    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );


    // Estrelas

    ctx.fillStyle = "white";


    for (let i = 0; i < 60; i++) {

        let x =
            (i * 137) % canvas.width;

        let y =
            (i * 83) % canvas.height;


        ctx.fillRect(

            x,
            y,
            2,
            2

        );

    }

}


// ==================================================
// HUD
// ==================================================

function drawHUD() {

    ctx.fillStyle = "white";

    ctx.font = "20px Arial";


    ctx.fillText(

        "HP: " + player.hp,

        20,
        30

    );


    ctx.fillText(

        "Pontos: " + score,

        20,
        55

    );

    ctx.fillText(

        "Tempo " + tempo,

        20,
        80

    );

}


// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {

    if (!gamePaused) {
        
        // -------------------------
        // ATUALIZAÇÃO
        // -------------------------

        updatePlayer();
        
        updateBullets();

        updateEnemies();

        updateBoss();

        // -------------------------
        // COLISÕES
        // -------------------------

        checkBulletCollisions();

        checkPlayerCollisions();

        checkBossCollisions();

        // -------------------------
        // DESENHO
        // -------------------------

        drawBackground();

        drawPlayer();

        drawBullets();

        drawEnemies();

        drawHUD();

        drawBoss();

        // -------------------------
        // Subir de Nivel
        // -------------------------

        if (player.level * 100 <= score) {
            openCards();
            player.level++;
            
        }

        if (
            player.level >= bossSpawnLevel &&
            !bossActive
        ) {
            spawnBoss();
        
        }
    }
    // Próximo frame
    
    requestAnimationFrame(gameLoop);

    
}


// ==================================================
// INICIAR
// ==================================================

gameLoop();
