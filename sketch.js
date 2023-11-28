let ballImage;
let playerRacketImage;
let computerRacketImage;
let backgroundImage;

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
      image(playerRacketImage, this.x, this.y, this.w, this.h);
    }
    else {
      imageMode(CENTER); // Set the image mode to CENTER
      image(computerRacketImage, this.x, this.y, this.w, this.h);
    }
  }

  move(direction) {
    // If it's the player's racket
    if (this.x < width / 2) {
      this.y += direction * this.speed;
    } else {
      // If it's computer's racket and the ball is above racket, move racket up
      if (ball.y < this.y) {
        this.y -= this.speed;
      }
      // If it's computer's racket and the ball is below racket, move racket down
      else if (ball.y > this.y) {
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
    image(ballImage, 0, 0, this.radius * 2, this.radius * 2);
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
    }
  
    if (this.y > height || this.y < 0) {
      this.vy *= -1;
      this.angle += PI; // Rotate 180 degrees
    }
  
    // Check if the ball is hitting the player's racket
    if (this.isHittingRacket(player)) {
      this.vx *= -1;
      this.angle += PI; // Rotate 180 degrees
    }
  
    // Check if the ball is hitting the computer's racket
    if (this.isHittingRacket(computer)) {
      this.vx *= -1;
      this.angle += PI; // Rotate 180 degrees
    }
  }

  isHittingRacket(racket) {
    return this.x + this.radius >= racket.x - racket.w / 2 && 
           this.x - this.radius <= racket.x + racket.w / 2 &&
           this.y + this.radius >= racket.y - racket.h / 2 && 
           this.y - this.radius <= racket.y + racket.h / 2;
  }
}

var ball;
var player;
var computer;

function preload() {
  ballImage = loadImage('assets/ball.png');
  playerRacketImage = loadImage('assets/player_racket.png');
  computerRacketImage = loadImage('assets/computer_racket.png');
  backgroundImage = loadImage('assets/background.png');
}

function setup() {
  createCanvas(800, 400);
  ball = new Ball();
  player = new Racket(30, 20, 20, 100, 5);
  computer = new Racket(760, 20, 20, 100, 3);
}

function draw() {
  // centralised background image, with canvas aspect ratio, and zoom out as maximum as possible
  let imgWidth = width;
  let imgHeight = width * backgroundImage.height / backgroundImage.width;
  if (imgHeight < height) {
    imgHeight = height;
    imgWidth = height * backgroundImage.width / backgroundImage.height;
  }
  image(backgroundImage, width / 2, height / 2, imgWidth, imgHeight);


  player.draw();
  player.move(keyIsDown(83) - keyIsDown(87));
  computer.draw();
  // Computer racket should move by itself
  computer.move();
  ball.update();
  ball.draw();
}