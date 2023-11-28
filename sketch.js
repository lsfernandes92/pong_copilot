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
  }
}

var ball;

function setup() {
  createCanvas(800, 400);
  ball = new Ball();
}

function draw() {
  background(0);
  ball.update();
  ball.draw();
}