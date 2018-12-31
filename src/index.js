
var states = Object.freeze({ "playing": 0, "playerWon": 1, "playerLost": 2 });
var state = states.playing;

class Game {
  constructor(context, width, height) {

    this.ctx = context;
    this.height = height;
    this.width = width;

    this.enemys;
    this.player;

    this.mousePos;
  }

  init(count) {
    this.player = new Player(100, 100, 10);

    this.enemys = [];
    var i;
    for (i = 0; i < count; i++) {
      this.enemys.push(new Enemy(
        Math.floor(Math.random()*3 + 1),
        Math.floor(Math.random()*3 + 1),
        Math.floor(Math.random()*60  + 10),
        Math.floor(Math.random()*(this.width - 100) + 100),
        Math.floor(Math.random()*(this.height - 100) + 100),
        this.width, this.height, this.player))
    }

    for (i = 0; i < 4; i++) {
      this.enemys.push(new Enemy(
        Math.floor(Math.random()*3 + 1),
        Math.floor(Math.random()*3 + 1),
        Math.floor(9*i),
        Math.floor(Math.random()*(this.width - 100) + 100),
        Math.floor(Math.random()*(this.height - 100) + 100),
        this.width, this.height, this.player))
    } 
  }

  setMousePos(mousePos) {
    this.mousePos = mousePos;
  }

  tick() {

    if (!(typeof this.mousePos === 'undefined')) {
      this.player.mouseX = this.mousePos.x;
      this.player.mouseY = this.mousePos.y;
    }

    this.player.tick();

    this.enemys.forEach(function (enemy, ) {
      enemy.tick();
    });

    this.enemys = this.enemys.filter(function (enemy) {
      return enemy.size > 0;
    });

    if (this.enemys.length === 0) {
      state = states.playerWon;
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);

    // draw background
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.closePath();

    this.player.draw(ctx)

    this.enemys.forEach(function (enemy) {
      enemy.draw(ctx);
    });

  }
}

class Player {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = 4;
    this.mouseX = x;
    this.mouseY = y;
  }

  tick() {

    if (state === states.playing) {
      var dx = this.mouseX - (this.x);
      var dy = this.mouseY - (this.y);

      var d = Math.abs(dx) + Math.abs(dy);
      if (d > 2) {
        this.x += this.speed * (dx / d);
        this.y += this.speed * (dy / d);
      }
      if (this.size <= 0) {
        state = states.playerLost;
      }

    } else if (state === states.playerWon) {
      this.size += 2;
    }
  }

  draw(ctx) {

    // draw Mouse line
    ctx.beginPath();
    ctx.strokeStyle = "#AAAAAA";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.mouseX, this.mouseY);
    ctx.stroke();

    // draw Player
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
  }
}

class Enemy {
  constructor(dx, dy, size, x, y, limitX, limitY, player) {
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.x = x;
    this.y = y;
    this.limitX = limitX;
    this.limitY = limitY;
    this.player = player;
    this.color = "#FF0000";
  }

  collision() {
    var distance = Math.ceil(Math.sqrt(Math.pow(this.player.x - this.x, 2) + Math.pow(this.player.y - this.y, 2)));
    if (distance < this.player.size + this.size) {
      var d = this.player.size + this.size - distance;
      if (this.player.size > this.size) {
        this.player.size += d;
        this.size -= d;
        if (this.size < 0) this.size = 0;
      }
      else {
        this.player.size -= d;
        if (this.player.size < 0) this.player.size = 0;
        this.size += d;
      }
    }
  }

  tick() {
    if (state === states.playing) {
      this.collision();

      if (this.player.size >= this.size) {
        this.color = "#770000";
      } else {
        this.color = "#FF0000";
      }

      // bounce on walls
      if (this.x + this.size > this.limitX || this.x - this.size < 0) {
        this.dx = this.dx * -1;
      }

      // bounce on ceiling and floor
      if (this.y + this.size > this.limitY || this.y - this.size < 0) {
        this.dy = this.dy * -1;
      }

      this.x += this.dx;
      this.y += this.dy;
    } else if (state === states.playerLost) {
      this.size += 1;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

}

var cvs = document.getElementById("canvas");

var ctx = cvs.getContext("2d");

var game = new Game(ctx, cvs.clientWidth, cvs.clientHeight);

game.init(5);

window.addEventListener('mousemove', evt => {
  var rect = cvs.getBoundingClientRect();
  game.setMousePos({
    x: (evt.clientX - rect.left) / (rect.right - rect.left) * cvs.width,
    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * cvs.height
  });
}, false)

window.onkeyup = function (e) {
  if (state !== states.playing) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 32) {
      state = states.playing;
      game.init(5);
    }
  }
}

function interval() {
  game.tick();
  game.draw(ctx);
}

setInterval(interval, 10);