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
    this.y += direction * this.speed;

    // Keep the racket within the canvas
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > height - this.h) {
      this.y = height - this.h;
    }
  }
}

class Ball {
  constructor() {
    this.x = 400;
    this.y = 200;
    this.vx = Math.random() * 10 - 5;
    this.vy = Math.random() * 10 - 5;
  }

  draw() {
    fill(255);
    ellipse(this.x, this.y, 50, 50);
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

    // check if the ball is hitting the racket, considering the ball's radius
    if (this.x >= player1.x && this.x <= player1.x + player1.w &&
      this.y >= player1.y && this.y <= player1.y + player1.h) {
      this.vx *= -1;
    }
  }
}

var ball;
var player1;

function setup() {
  createCanvas(800, 400);
  ball = new Ball();
  player1 = new Racket(20, 20, 20, 100, 5);
}

function draw() {
  background(0);
  player1.draw();
  player1.move(keyIsDown(83) - keyIsDown(87));
  ball.update();
  ball.draw();
}