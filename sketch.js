class Game {
  constructor() {
    this.ballImage = null;
    this.playerRacketImage = null;
    this.computerRacketImage = null;
    this.backgroundImage = null;
    this.bounceSound = null;
    this.scoreSound = null;
    this.playerScore = 0;
    this.computerScore = 0;
    this.player = new Racket(20, 20, 20, 100, 5);
    this.computer = new Racket(760, 20, 20, 100, 3);
    this.ball = new Ball();
    this.scoreKeeper = new ScoreKeeper();
  }

  preload() {
    this.ballImage = loadImage("assets/ball.png");
    this.playerRacketImage = loadImage("assets/player_racket.png");
    this.computerRacketImage = loadImage("assets/computer_racket.png");
    this.backgroundImage = loadImage("assets/background.png");
    this.bounceSound = loadSound("assets/bounce.wav");
    this.scoreSound = loadSound("assets/score.wav");
  }

  draw() {
    this.renderBackground();
    this.renderSprites();
    this.displayScore();
  }

  renderBackground() {
    let imgWidth = width;
    let imgHeight =
      (width * game.backgroundImage.height) / game.backgroundImage.width;
    if (imgHeight < height) {
      imgHeight = height;
      imgWidth = (height * backgroundImage.width) / backgroundImage.height;
    }
    image(game.backgroundImage, width / 2, height / 2, imgWidth, imgHeight);
  }

  renderSprites() {
    this.player.draw();
    this.player.move(keyIsDown(83) - keyIsDown(87));
    this.computer.draw();
    this.computer.move();
    this.ball.update();
    this.ball.draw();
  }

  displayScore() {
    textSize(32);
    fill(255);
    text(this.scoreKeeper.playerScore, width / 4, 50);
    text(this.scoreKeeper.computerScore, (3 * width) / 4, 50);
  }
}

class Racket {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
  }

  draw() {
    let racketImage =
      map(this.x, 0, width, 0, 1) < 0.5
        ? game.playerRacketImage
        : game.computerRacketImage;
    imageMode(CENTER); // Set the image mode to CENTER
    image(racketImage, this.x, this.y, this.w, this.h);
  }

  move(direction) {
    if (this.x < width / 2) {
      this.movePlayerRacket(direction);
    } else {
      this.moveComputerRacket();
    }
    this.keepRacketWithinCanvas();
  }

  movePlayerRacket(direction) {
    this.y += direction * this.speed;
  }

  moveComputerRacket() {
    if (game.ball.y < this.y) {
      this.y -= this.speed;
    } else if (game.ball.y > this.y) {
      this.y += this.speed;
    }
  }

  keepRacketWithinCanvas() {
    if (this.y - this.h / 2 < 0) {
      this.y = this.h / 2;
    } else if (this.y + this.h / 2 > height) {
      this.y = height - this.h / 2;
    }
  }
}

class Ball {
  constructor() {
    this.x = 400;
    this.y = 200;
    this.vx = Math.random() * 10 - 5;
    this.vy = Math.random() * 10 - 5;
    this.radius = 25; // Assuming the diameter of the ball is 50
    this.angle = 0; // Add rotation angle
  }

  draw() {
    // draw the ball
    imageMode(CENTER); // Set the image mode to CENTER
    push(); // Save the current transformation matrix
    translate(this.x, this.y); // Move to the ball's position
    rotate(this.angle); // Rotate by the ball's angle
    image(game.ballImage, 0, 0, this.radius * 2, this.radius * 2);
    pop(); // Restore the transformation matrix
  }

  update() {
    this.move();
    this.checkForScore();
    this.checkForBounce();
    this.checkForRacketCollision();
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += (this.vx + this.vy) / 25; // Rotates according to the velocity of x and y
  }

  checkForScore() {
    if (this.x > width || this.x < 0) {
      this.resetPosition();
      game.scoreSound.play();
      if (this.x < width / 2) {
        game.scoreKeeper.incrementComputerScore();
      } else {
        game.scoreKeeper.incrementPlayerScore();
      }
      game.scoreKeeper.sayScore();
    }
  }

  resetPosition() {
    this.x = width / 2;
    this.y = height / 2;
  }

  checkForBounce() {
    if (this.y > height || this.y < 0) {
      this.vy *= -1;
      this.angle += PI; // Rotate 180 degrees
    }
  }

  checkForRacketCollision() {
    if (
      this.isHittingRacket(game.player) ||
      this.isHittingRacket(game.computer)
    ) {
      this.vx *= -1;
      this.angle += PI; // Rotate 180 degrees
      game.bounceSound.play();
    }
  }

  isHittingRacket(racket) {
    return (
      this.x + this.radius >= racket.x - racket.w / 2 &&
      this.x - this.radius <= racket.x + racket.w / 2 &&
      this.y + this.radius >= racket.y - racket.h / 2 &&
      this.y - this.radius <= racket.y + racket.h / 2
    );
  }
}

class ScoreKeeper {
  constructor() {
    this.playerScore = 0;
    this.computerScore = 0;
  }

  incrementPlayerScore() {
    this.playerScore++;
  }

  incrementComputerScore() {
    this.computerScore++;
  }

  sayScore() {
    let msg = new SpeechSynthesisUtterance();
    msg.text = "The score is: " + this.playerScore + " to " + this.computerScore;
    window.speechSynthesis.speak(msg);
  }
}

let game;

function preload() {
  game = new Game();
  game.preload();
}

function setup() {
  createCanvas(800, 400);
}

function draw() {
  game.draw();
}
