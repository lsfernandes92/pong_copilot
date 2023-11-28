class Racket {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
  }

  draw() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }

  move(direction) {
    // Keep the racket within the canvas
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > height - this.h) {
      this.y = height - this.h;
    }

    // If it's the player's racket
    if (this.x < width / 2) {
      this.y += direction * this.speed;
    } else {
      // If it's computer's racket and the ball is above racket, move racket up
      if (ball.y < this.y + this.h / 2) {
        this.y -= this.speed;
      }
      // If it's computer's racket and the ball is below racket, move racket down
      else if (ball.y > this.y + this.h / 2) {
        this.y += this.speed;
      }
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
  }

  draw() {
    fill(255);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > width || this.x < 0) {
      this.x = width / 2;
      this.y = height / 2;
    }

    if (this.y > height || this.y < 0) {
      this.vy *= -1;
    }

    // Check if the ball is hitting the player's racket
    if (this.isHittingRacket(player)) {
      this.vx *= -1;
    }

    // Check if the ball is hitting the computer's racket
    if (this.isHittingRacket(computer)) {
      this.vx *= -1;
    }
  }

  isHittingRacket(racket) {
    return this.x + this.radius >= racket.x && this.x - this.radius <= racket.x + racket.w &&
      this.y + this.radius >= racket.y && this.y - this.radius <= racket.y + racket.h;
  }
}

var ball;
var player;
var computer;

function setup() {
  createCanvas(800, 400);
  ball = new Ball();
  player = new Racket(20, 20, 20, 100, 5);
  computer = new Racket(760, 20, 20, 100, 3);
}

function draw() {
  background(0);
  player.draw();
  player.move(keyIsDown(83) - keyIsDown(87));
  computer.draw();
  // Computer racket should move by itself
  computer.move();
  ball.update();
  ball.draw();
}