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
  }

  preload() {
    this.ballImage = loadImage('assets/ball.png');
    this.playerRacketImage = loadImage('assets/player_racket.png');
    this.computerRacketImage = loadImage('assets/computer_racket.png');
    this.backgroundImage = loadImage('assets/background.png');
    this.bounceSound = loadSound('assets/bounce.wav');
    this.scoreSound = loadSound('assets/score.wav');
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
    // draw the racket if player or computer
    if (this.x < width / 2) {
      imageMode(CENTER); // Set the image mode to CENTER
      image(game.playerRacketImage, this.x, this.y, this.w, this.h);
    }
    else {
      imageMode(CENTER); // Set the image mode to CENTER
      image(game.computerRacketImage, this.x, this.y, this.w, this.h);
    }
  }

  move(direction) {
    // If it's the player's racket
    if (this.x < width / 2) {
      this.y += direction * this.speed;
    } else {
      // If it's computer's racket and the ball is above racket, move racket up
      if (game.ball.y < this.y) {
        this.y -= this.speed;
      }
      // If it's computer's racket and the ball is below racket, move racket down
      else if (game.ball.y > this.y) {
        this.y += this.speed;
      }
    }

    // Keep the racket within the canvas
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
    this.x += this.vx;
    this.y += this.vy;
    // Rotates according to the velocity of x and y
    this.angle += (this.vx + this.vy) / 25;
  
    if (this.x > width || this.x < 0) {
      this.x = width / 2;
      this.y = height / 2;
      game.scoreSound.play();
      sayScore();
    }
  
    if (this.y > height || this.y < 0) {
      this.vy *= -1;
      this.angle += PI; // Rotate 180 degrees
    }
  
    // Check if the ball is hitting the player's racket
    if (this.isHittingRacket(game.player)) {
      this.vx *= -1;
      this.angle += PI; // Rotate 180 degrees
      game.bounceSound.play();
    }
  
    // Check if the ball is hitting the computer's racket
    if (this.isHittingRacket(game.computer)) {
      this.vx *= -1;
      this.angle += PI; // Rotate 180 degrees
      game.bounceSound.play();
    }
  }

  isHittingRacket(racket) {
    return this.x + this.radius >= racket.x - racket.w / 2 && 
           this.x - this.radius <= racket.x + racket.w / 2 &&
           this.y + this.radius >= racket.y - racket.h / 2 && 
           this.y - this.radius <= racket.y + racket.h / 2;
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
  // centralised background image, with canvas aspect ratio, and zoom out as maximum as possible
  let imgWidth = width;
  let imgHeight = width * game.backgroundImage.height / game.backgroundImage.width;
  if (imgHeight < height) {
    imgHeight = height;
    imgWidth = height * backgroundImage.width / backgroundImage.height;
  }
  image(game.backgroundImage, width / 2, height / 2, imgWidth, imgHeight);

  game.player.draw();
  game.player.move(keyIsDown(83) - keyIsDown(87));
  game.computer.draw();
  game.computer.move();
  game.ball.update();
  game.ball.draw();

  textSize(32);
  fill(255);
  text(game.playerScore, width / 4, 50);
  text(game.computerScore, 3 * width / 4, 50);
}

function sayScore() {
  // If the ball is on the left side of the canvas, the computer scores
  if (this.x < width / 2) {
    game.computerScore++;
  }
  // If the ball is on the right side of the canvas, the player scores
  else {
    game.playerScore++;
  }
  // use speech synthesis to say the score
  let msg = new SpeechSynthesisUtterance();
  msg.text = "The score is: " + game.playerScore + " to " + game.computerScore;
  window.speechSynthesis.speak(msg);
}