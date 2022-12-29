const canvas = document.getElementById("gameCanvas");
document.body.style.overflow = "hidden";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gameOverTitle = document.getElementById('gameOver')

const ctx = canvas.getContext("2d");

const explosion = document.getElementById("explosion");
const laser = document.getElementById("laser");
const levelSound = document.getElementById("level");
explosion.volume = 0.6

// Load the player sprite
const playerSprite = new Image();
playerSprite.src = "player.png";

// Load the enemy sprites
const enemySprites = [new Image(), new Image(), new Image()];
enemySprites[0].src = "enemy1.png";
enemySprites[1].src = "enemy2.png";
enemySprites[2].src = "enemy3.png";

const player = {
  x: canvas.width / 2, // the position on the x axis
  y: canvas.height -100,  // the position on the y axis
  width: 50,
  height: 50,
  speed: 15,
  hit: false,
};

// Create the enemies array
const enemies = [];

function createEnemies() {
  // Clear the enemies array
  enemies.length = 0;

  // Generate 9 enemies
  for (let i = 0; i < 9; i++) {
    // Choose a random enemy sprite
    const spriteIndex = Math.floor(Math.random() * enemySprites.length);
    // Add a new enemy object to the enemies array
    enemies.push({
      x: Math.random() * (canvas.width - 50),
      y: 0 - Math.random() * (canvas.height),
      width: 50,
      height: 50,
      sprite: enemySprites[spriteIndex],
    });
  }
}

const bullets = [];
let lastTimestamp = 0;

function movePlayer(direction) {
 
  switch(direction){
    case "left":
      player.x -= player.speed;
      break;
    case "right":
      player.x += player.speed;
      break;
    case "up":
      player.y -= player.speed;
      break;
    case "down":
      player.y += player.speed;
      break;
    default:
      null
  }
  // Keep the player within the bounds of the canvas
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }
  if (player.y < 0) {
    player.y = 0;
  } else if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
  }
}

function moveEnemies() {
  // Move each enemy down by 2 pixels
  for (const enemy of enemies) {
    enemy.y += 2;
  }
}

function moveBullets() {
  // Move each bullet up by 10 pixels
  for (const bullet of bullets) {
    bullet.y -= 10;
  }
}

function shoot() {
// Add a new bullet object to the bullets array
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 5,
        height: 20,
    });
}
    
function checkCollisions() {
  // Check for collisions between bullets and enemies
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        if (
            bullet.x >= enemy.x &&
            bullet.x <= enemy.x + enemy.width &&
            bullet.y >= enemy.y &&
            bullet.y <= enemy.y + enemy.height
        ) {
        // Remove the bullet and enemy
            bullets.splice(i, 1);
            enemies.splice(j, 1);
            score += 100;
            explosion.play();
            updateScore();
            i--;
            break;
        }
    }
  }

// Check for collisions between enemies and the player
  for (const enemy of enemies) {
    if (
        enemy.x >= player.x &&
        enemy.x <= player.x + player.width &&
        enemy.y >= player.y &&
        enemy.y <= player.y + player.height
    ) {
        player.x=canvas.width / 2,
        player.y=canvas.height -100,
        player.width=50,
        player.height=50,
        player.speed=15,
        player.hit=true,
        lives--;
        explosion.play();
        updateScore();
    }
  }
}
function draw() {
// Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw the player
  if(!player.hit){
    ctx.drawImage(playerSprite, player.x, player.y, player.width, player.height);
  } else{
    ctx.drawImage(playerSprite, player.x=canvas.width / 2, player.y=canvas.height -100, player.width=50, player.height=50);
    player.hit=false
  }
// Draw the enemies
    for (const enemy of enemies) {
        ctx.drawImage(enemy.sprite, enemy.x, enemy.y, enemy.width, enemy.height);
    }

// Draw the bullets
    ctx.fillStyle = "white";

    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function gameOver(){
    lives += 3;
    level = 1;
    speed = 20;
    timer = 30000;
    add();
    updateScore();
    gameOverTitle.classList.remove('hidden');
}

// score
const scoreElement = document.getElementById("score");
let score = 0;
let lives = 3;

function update() {
// Move the player and enemies
    movePlayer();
    moveEnemies();
    moveBullets();
//regenerate enemies
    if(enemies.length === 0 ) {
      createEnemies()
      moveEnemies()
      clearInterval(enemyInterval);
      enemyInterval = null;
      drawEnemies()
      levels()
    }
// Check for collisions
    checkCollisions();
// check lives
    if(lives === 0){
      gameOver();
      clearInterval(gameInterval);
      gameInterval = null;
      document.getElementById('restart').addEventListener('click', (e) => {
        console.log('it works')
        enemies.length =0
        score = 0
        drawGame()
        drawEnemies()
        gameOverTitle.classList.add('hidden')
      })
    }
// Draw the game
    draw();
}



// Update the score element's content
function updateScore() {
  scoreElement.innerHTML = `Score: ${score} Lives: ${lives}`;
}

document.addEventListener("keydown", (event) => {
    switch(event.code) {
      case "ArrowLeft":
        movePlayer("left", event.timeStamp);
        break;
      case "ArrowRight":
        movePlayer("right", event.timeStamp);
        break;
      case "ArrowUp":
        movePlayer("up", event.timeStamp);
        break;
      case "ArrowDown":
        movePlayer("down", event.timeStamp);
        break;
      case "Space":
        shoot();
        laser.play()
        break;
    }
}); 
let level = 0
let speed = 20
let timer = 30000
const levelTitle = document.getElementById('gameLevel')
const add = () => levelTitle.classList.add('hidden')
const remove = () => levelTitle.classList.remove('hidden')

function levels() {
  if (timer >= 20000){
  levelTitle.innerHTML = `LEVEL<br/> ${level}`;
  remove();
  level++
  speed += 15
  timer -= 1500
  setTimeout(add, 3000);
  } else {
    timer = 18000;
    levelTitle.innerHTML = `LEVEL<br/> ${level}`;
    remove();
    level++
    setTimeout(add, 3000);
  }
}

// Generate enemies
let enemyInterval
function drawEnemies() {
  if (!enemyInterval) {
    enemyInterval = setInterval(()=>{
      createEnemies();
      moveEnemies();
      levels();
      levelSound.play();
    }, timer);
  }
}
drawEnemies();
levels()

// render the game
let gameInterval
function drawGame() {
  if (!gameInterval) {
    gameInterval = setInterval(update, 1000 / speed); // 60 frames per second
  }
}
drawGame();