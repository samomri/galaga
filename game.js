// Get a reference to the canvas element
const canvas = document.getElementById("gameCanvas");

// Get a reference to the canvas context, which is used to draw on the canvas
const ctx = canvas.getContext("2d");

// Load the player sprite
const playerSprite = new Image();
playerSprite.src = "player.png";

// Load the enemy sprites
const enemySprites = [new Image(), new Image(), new Image()];
enemySprites[0].src = "enemy1.png";
enemySprites[1].src = "enemy2.png";
enemySprites[2].src = "enemy3.png";

// Create the player object
const player = {
  x: canvas.width / 2,
  y: canvas.height -100,
  width: 50,
  height: 50,
  speed: 15,
};

// Create the enemies array
const enemies = [];

// Create a function to generate enemies
function createEnemies() {
  // Clear the enemies array
  enemies.length = 0;

  // Generate 9 enemies
  for (let i = 0; i < 9; i++) {
    // Choose a random enemy sprite
    const spriteIndex = Math.floor(Math.random() * enemySprites.length);
    console.log(spriteIndex)
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

// Create the bullets array
const bullets = [];
let lastTimestamp = 0;
// Create a function to handle player movement
function movePlayer(direction,timestamp) {
    // Calculate the elapsed time since the last frame
  const elapsed = timestamp - lastTimestamp;

  // Update the last timestamp
  lastTimestamp = timestamp;

  // Calculate the distance to move based on the elapsed time and player speed
  const distance = elapsed * player.speed;
  // Update the player's position based on the direction
  if (direction === "left") {
    player.x -= player.speed;
  } else if (direction === "right") {
    player.x += player.speed;
  }

  // Keep the player within the bounds of the canvas
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }
}

// Create a function to handle enemy movement
function moveEnemies() {
  // Move each enemy down by 2 pixels
  for (const enemy of enemies) {
    enemy.y += 2;
  }
}

// Create a function to handle bullet movement
function moveBullets() {
  // Move each bullet up by 10 pixels
  for (const bullet of bullets) {
    bullet.y -= 10;
  }
}

// Create a function to handle player shooting
function shoot() {
// Add a new bullet object to the bullets array
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 5,
        height: 20,
    });
}
    
// Create a function to check for collisions
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
    // Game over
        console.log("Game over");
    }
    }
}

// Create a function to draw the game state
function draw() {
// Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw the player
    ctx.drawImage(playerSprite, player.x, player.y, player.width, player.height);

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

// Create a function to update the game state
function update() {
// Move the player and enemies
    movePlayer();
    moveEnemies();
    moveBullets();

// Check for collisions
    checkCollisions();

// Draw the game
    draw();
}

// Set up the event listeners to handle player input
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
        movePlayer("left", event.timeStamp);
    } else if (event.code === "ArrowRight") {
        movePlayer("right", event.timeStamp);
    } else if (event.code === "Space") {
        shoot();
    }
});

// Get a reference to the score element
const scoreElement = document.getElementById("score");

// Set up a score variable to track the player's score
let score = 0;

// Set up a lives variable to track the player's lives
let lives = 3;

// Update the score element's content
function updateScore() {
  scoreElement.innerHTML = `Score: ${score} Lives: ${lives}`;
}

// Update the score and lives when an enemy is killed
function enemyKilled() {
  score += 100;
  updateScore();
}

// Update the lives when the player is hit
function playerHit() {
  lives--;
  updateScore();
}

// Generate the initial set of enemies
createEnemies();

// Start the game loop
setInterval(update, 1000 / 30); // 60 frames per second