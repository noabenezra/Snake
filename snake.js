const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
// create the unit
const box = 32;
const winScore = 40;
// load images
const ground = new Image();
ground.src = "img/yellow.jpg";
const foodImg = new Image();
foodImg.src = "img/bug.png";

var fruitImages = [
    'img/ciliegia.png',
    'img/orange.png',
    'img/banana.png',
    'img/apple.png',
    'img/fragola.png'
];

var newGame = true; //True when starting game
var direction = "RIGHT";
var previousDirection = "RIGHT"; //Game previous direction (for preventing errors)
var previousArrowDirection = "RIGHT"; //Previous selection (for preventint errors)
var nextDirection = null; //Next set direction (default null)
var score = 0; // Score
var level = 1;
var paused = true; //True if game is paused
var game = 0;
var food = {};
var bonus = {}; //Game bonuses
var fruits = []; //Game bonus fruits
var fruitValues = [2, 4, 6, 8, 10];
var fruitDuration = 5; //Seconds,
var Snake = [];
var items = [
    { x: 2 * box, y: 3 * box, width: 6 * box, height: 1 * box },
    { x: 2 * box, y: 4 * box, width: 1 * box, height: 2 * box },
    { x: 5 * box, y: 17 * box, width: 5 * box, height: 1 * box },
    { x: 15 * box, y: 4 * box, width: 1 * box, height: 5 * box },
    { x: 24 * box, y: 13 * box, width: 1 * box, height: 5 * box },
    { x: 23 * box, y: 17 * box, width: 2 * box, height: 1 * box }
];

//Games methods
function Play() {
    if (newGame) {
        Init();
    }
    $('#canvas-overlay').fadeOut('fast');
    game = setInterval(Tick, 100);
    paused = false;
    newGame = false;
}

function Init() {
    direction = "RIGHT";
    previousDirection = "RIGHT";
    previousArrowDirection = "RIGHT";
    score = 0;
    Snake = [];
    items = [];
    ReloadFruit();
    CreateFood();
    CreateSnake();
    CreateWalls();

    $('#score-num').text(score.toString());
    $('#level-num').text(level.toString());
}

function ReloadFruit() {
    //Preload fruit images
    for (var j = 0; j < fruitImages.length; j++) {
        const img = new Image();
        img.src = fruitImages[j];
        fruits.push({ img: img, value: fruitValues[j] });
    }
}


function Tick() {
    Update();
    Draw();
}

function CreateConstantWalls() {
    items = [
        { x: 2 * box, y: 3 * box, width: 6 * box, height: 1 * box },
        { x: 2 * box, y: 4 * box, width: 1 * box, height: 2 * box },
        { x: 5 * box, y: 17 * box, width: 5 * box, height: 1 * box },
        { x: 15 * box, y: 4 * box, width: 1 * box, height: 5 * box },
        { x: 24 * box, y: 13 * box, width: 1 * box, height: 5 * box },
        { x: 23 * box, y: 17 * box, width: 2 * box, height: 1 * box }
    ];
}

function CreateDynamicWall(xRangeBegin, xRangeEnd, yRangeBegin, yRangeEnd) {
    let x = Math.floor(Math.random() * (xRangeEnd - xRangeBegin) + xRangeBegin);
    let y = Math.floor(Math.random() * (yRangeEnd - yRangeBegin) + yRangeBegin);
    let width = Math.floor(Math.random() * 3 + 1);
    let height = Math.floor(Math.random() * 3 + 1);
    items.push({ x: x * box, y: y * box, width: width * box, height: height * box });
}


function CreateDynamicWalls() {
    /* let xRange = 13 * box; //416
     let yRange = 9 * box; //288
     let xRangeEnd = 27 * box; //864
     let yRangeEnd = 19 * box; //608*/
    CreateDynamicWall(1, 12, 1, 8);
    CreateDynamicWall(14, 26, 1, 8);
    CreateDynamicWall(1, 12, 10, 18);
    CreateDynamicWall(14, 26, 10, 18);
}


function CreateWalls() {
    if (level == 3)
        CreateConstantWalls();
    else if (level >= 4)
        CreateDynamicWalls();
}

function AddBonus() {
    if (!bonus.active && level == 2) {
        var correct = false;

        while (!correct) {
            bonus = {
                x: Math.floor(Math.random() * 26 + 0) * box,
                y: Math.floor(Math.random() * 18 + 0) * box,
                active: true
            };
            correct = true;
            for (var i = 0; i < Snake.length; i++) {
                var c = Snake[i];
                if (c.x == bonus.x && c.y == bonus.y) {
                    correct = false;
                }
            }
        }
        var fruit = fruits[Math.floor(Math.random() * fruits.length)];
        bonus.img = fruit.img;
        bonus.value = fruit.value;
        DrawFruit();
        setTimeout(function() {
            //Remove fruit
            bonus = {};
        }, fruitDuration * 1000);
    }
}

function DrawFruit() {
    if (bonus.active && level == 2) {
        ctx.drawImage(bonus.img, bonus.x, bonus.y, box, box);
    }
}
// create the food
function CreateFood() {
    var correct = false;

    while (!correct) {
        food = {
            x: Math.floor(Math.random() * 26 + 0) * box,
            y: Math.floor(Math.random() * 18 + 0) * box
        };
        correct = true;
        for (var i = 0; i < Snake.length; i++) {
            var c = Snake[i];
            if (c.x == food.x && c.y == food.y) {
                correct = false;
            }
        }
        if ((level == 3 || level == 4) && correct == true) {
            for (let i = 0; i < items.length; i++) {
                if (food.x >= items[i].x &&
                    food.x < items[i].x + items[i].width &&
                    food.y >= items[i].y &&
                    food.y < items[i].y + items[i].height) {
                    correct = false;
                }
            }
        }
    }
}
// create the snake
function CreateSnake() {
    Snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
};

function Update() {
    ctx.clearRect(0, 0, 864, 608);
}

function DrawGround() {
    ctx.drawImage(ground, 0, 0);

}

function DrawFood() {
    ctx.drawImage(foodImg, food.x, food.y, 32, 32);
}

function DrawSnake() {
    for (let i = 0; i < Snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#ddba76" : "white";
        ctx.fillRect(Snake[i].x, Snake[i].y, box, box);
        ctx.strokeStyle = "#ddba76";
        ctx.strokeRect(Snake[i].x, Snake[i].y, box, box);
    }
}

function DrawWalls() {
    if (level == 3) {
        for (let i = 0; i < items.length; i++) {
            ctx.fillStyle = "#97421d";
            ctx.fillRect(items[i].x, items[i].y, items[i].width, items[i].height);
        }
    } else if (level == 4) {
        for (let i = 0; i < items.length; i++) {
            ctx.fillStyle = "#97421d";
            ctx.fillRect(items[i].x, items[i].y, items[i].width, items[i].height);
        }
    }
}

function IsDirectionalityChangeIsTooFast() {
    //Check if directionality change is too fast
    if (typeof previousDirection !== "undefined") {
        var useNextDirection = false;
        if ((previousDirection == "RIGHT" && direction == "LEFT") || (previousDirection == "LEFT" && direction == "RIGHT") ||
            (previousDirection == "UP" && direction == "DOWN") || (previousDirection == "DOWN" && direction == "UP")) {
            nextDirection = direction;
            direction = previousArrowDirection;
            useNextDirection = false;
        } else {
            useNextDirection = true;
        }
        //If NextDirection is stored, use it
        if (nextDirection != null && useNextDirection) {
            direction = nextDirection;
            nextDirection = null;
        }
    }
    previousDirection = direction;
}

function SwitchDirection(snakeX, snakeY) {
    // switch direction
    if (direction == "LEFT") snakeX = snakeX - box;
    if (direction == "UP") snakeY = snakeY - box;
    if (direction == "RIGHT") snakeX = box + snakeX;
    if (direction == "DOWN") snakeY = box + snakeY;
}

function IsSnakeEatsFood(snakeX, snakeY) {
    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        AddScore(1);
        CreateFood();
        AddBonus();
        // we don't remove the tail    
    } else if (level == 2 && snakeX == bonus.x && snakeY == bonus.y) {
        // if snake eats the bonus points
        AddScore(bonus.value);
        bonus = {};
        // remove the tail
        Snake.pop();
    } else {
        // remove the tail
        Snake.pop();
    }
}

function CheckIfGameOver(snakeX, snakeY) {
    // add new Head
    let newHead = {
            x: snakeX,
            y: snakeY
        }
        // game over
    if (CheckSelfCollision(newHead)) {
        Lose();
        return;
    }
    if (CheckBorderCollision(newHead)) {
        Lose();
        return;
    }
    if ((level == 3 || level == 4) && CheckWallsCollision(newHead)) {
        Lose();
        return;
    }
    // add new Head
    Snake.unshift(newHead);
}

function MoveSnake() {

    // old head position
    var snakeX = Snake[0].x;
    var snakeY = Snake[0].y;

    if (CheckWin()) {
        WinLevel();
        return;
    }

    IsDirectionalityChangeIsTooFast();
    // switch direction
    if (direction == "LEFT") snakeX = snakeX - box;
    if (direction == "UP") snakeY = snakeY - box;
    if (direction == "RIGHT") snakeX = box + snakeX;
    if (direction == "DOWN") snakeY = box + snakeY;
    //SwitchDirection(snakeX, snakeY);
    IsSnakeEatsFood(snakeX, snakeY);
    CheckIfGameOver(snakeX, snakeY);
}

// draw everything to the canvas
function Draw() {
    DrawGround();
    DrawSnake();
    DrawFood();
    DrawFruit();
    DrawWalls();
    MoveSnake();
}
//Check collision on walls - level 3
function CheckWallsCollision(newHead) {
    for (let i = 0; i < items.length; i++) {
        if (newHead.x >= items[i].x &&
            newHead.x < items[i].x + items[i].width &&
            newHead.y >= items[i].y &&
            newHead.y < items[i].y + items[i].height) {
            return true;
        }
    }
    return false;
}
//Check collision on snake itself
function CheckSelfCollision(newHead) {
    for (let i = 0; i < Snake.length; i++) {
        if (newHead.x == Snake[i].x && newHead.y == Snake[i].y) {
            return true;
        }
    }
    return false;
}

//Check collision on border
function CheckBorderCollision(newHead) {
    if (newHead.x < 0 || newHead.x > 26 * box || newHead.y < 0 || newHead.y > 18 * box) {
        return true;
    }
    return false;
}

function AddScore(added) {
    score = score + added;
    $('#score-num').text(score);
}

function Lose() {
    clearInterval(game);
    $('#canvas-overlay').fadeIn('fast');
    $('#overlay-text').html('Try Again!<br><br><span class="small">Press ENTER to restart</span>');
    paused = true;
    newGame = true;
    level = 1;
}

function WinLevel() {
    clearInterval(game);
    if (level == 4) {
        $('#canvas-overlay').fadeIn('fast');
        $('#overlay-text').html('Good Job!!! ' + '<br><br><span class="small">You Win</span>');
        level = 1;
        paused = true;
        newGame = true;
        return;
    }
    $('#canvas-overlay').fadeIn('fast');
    $('#overlay-text').html('You Win level ' + level + '!<br><br><span class="small">Press ENTER to start next level</span>');
    level++;
    $('#level-num').text(level.toString());
    paused = true;
    newGame = true;
}
//Check if Win
function CheckWin() {
    if (score >= winScore) {
        return true;
    }
    return false;
}

//Click on play button
$(document).on('click', '#overlay-text', function() {
    Play();
});

//control the snake
document.addEventListener("keydown", Direction);

function Direction(event) {
    var key = event.keyCode;
    previousArrowDirection = direction;
    if (key == 37 && direction != "RIGHT") {
        direction = "LEFT";
        return false;
    } else if (key == 38 && direction != "DOWN") {
        direction = "UP";
        return false;
    } else if (key == 39 && direction != "LEFT") {
        direction = "RIGHT";
        return false;
    } else if (key == 40 && direction != "UP") {
        direction = "DOWN";
        return false;
    } else if (key == 13) {
        //Press Enter
        if (paused) {
            Play();
        }
    }
}
