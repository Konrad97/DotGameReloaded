
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
    var playerSize = 5;

    this.player = new Player(100, 100, playerSize, this.width, this.height);

    this.enemys = [];
    var i;

    for (i = 1; i < count + 1; i++) {
      var size = playerSize  * i;
      this.enemys.push(new Enemy(
        Math.random() < 0.5 ? Math.floor(Math.random() * 3 + 1) : -Math.floor(Math.random() * 4 + 1),
        Math.random() < 0.5 ? Math.floor(Math.random() * 3  + 1) : -Math.floor(Math.random() * 4 + 1),
        Math.floor(size),
        this.width - size,
        Math.floor(Math.random() * (this.height - 2*  size) + size),
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


    this.enemys.forEach(function (enemy, ) {
      enemy.tick();
    });

    this.enemys = this.enemys.filter(function (enemy) {
      return enemy.size > 0;
    });

    if (this.enemys.length === 0) {
      state = states.playerWon;
    }

    this.player.tick();

  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);

    // draw background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.width, this.height);

    this.player.draw(ctx)

    this.enemys.forEach(function (enemy) {
      enemy.draw(ctx);
    });

    if (state === states.playing) {
      ctx.font = "30px Consolas";
      ctx.fillStyle = "white";
      ctx.fillText(this.player.size, 10, 30);
    } else if (state === states.playerLost) {
      ctx.font = "30px Consolas";
      ctx.fillStyle = "black";
      ctx.fillText("You lost!", this.width / 2 - 85, this.height / 2 - 50);
      ctx.fillText("Press [Space] to play again!", this.width / 2 - 225, this.height / 2 + 50);

    } else if (state === states.playerWon) {
      ctx.font = "30px Consolas";
      ctx.fillStyle = "black";
      ctx.fillText("Congrats, you Won!", this.width / 2 - 130, this.height / 2 - 50);
      ctx.fillText("Press [Space] to play again!", this.width / 2 - 225, this.height / 2 + 50);

    }
  }
}

class Player {
  constructor(x, y, size, limitX, limitY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.limitX = limitX;
    this.limitY = limitY;
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

      if(this.x + this.size > this.limitX){
        this.x = this.limitX - this.size;
      }
      if(this.x - this.size < 0){
        this.x = 0 + this.size;
      }
      if(this.y + this.size > this.limitY){
        this.y = this.limitY - this.size;
      }
      if(this.y - this.size < 0){
        this.y = 0 + this.size;
      }

    } else if (state === states.playerWon) {
      this.size += 1;
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
    var distance = Math.floor(Math.sqrt(Math.pow(this.player.x - this.x, 2) + Math.pow(this.player.y - this.y, 2)));
    if (distance < this.player.size + this.size) {
      var d = this.player.size + this.size - distance;
      if (this.player.size >= this.size) {
        if (d < this.size) {
          this.player.size += d;
          this.size -= d;
        } else {
          this.player.size += this.size;
          this.size = 0;
        }
      }
      else {
        if (d < this.player.size) {
           this.player.size -= d;
          this.size += d;
        } else {
          this.size += this.player.size;
          this.player.size = 0;
        }
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

var count = 8;

game.init(count);

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
      game.init(count);
    }
  }
}

function interval() {
  game.tick();
  game.draw(ctx);
}

setInterval(interval, 10);