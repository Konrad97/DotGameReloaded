var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game;
(function (Game) {
    var Circle = /** @class */ (function () {
        function Circle(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }
        Circle.prototype.draw = function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };
        return Circle;
    }());
    Game.Circle = Circle;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Enemy = /** @class */ (function (_super) {
        __extends(Enemy, _super);
        function Enemy(dx, dy, size, x, y, limitX, limitY, player) {
            var _this = _super.call(this, x, y, size, '#FF0000') || this;
            _this.dx = dx;
            _this.dy = dy;
            _this.limitX = limitX;
            _this.limitY = limitY;
            _this.player = player;
            _this.color = "#FF0000";
            return _this;
        }
        Enemy.prototype.collision = function () {
            var distance = Math.floor(Math.sqrt(Math.pow(this.player.x - this.x, 2) + Math.pow(this.player.y - this.y, 2)));
            if (distance < this.player.radius + this.radius) {
                var d = this.player.radius + this.radius - distance;
                if (this.player.radius >= this.radius) {
                    if (d < this.radius) {
                        this.player.radius += d;
                        this.radius -= d;
                    }
                    else {
                        this.player.radius += this.radius;
                        this.radius = 0;
                    }
                }
                else {
                    if (d < this.player.radius) {
                        this.player.radius -= d;
                        this.radius += d;
                    }
                    else {
                        this.radius += this.player.radius;
                        this.player.radius = 0;
                    }
                }
            }
        };
        Enemy.prototype.tick = function () {
            if (Game.Game.state === Game.GameState.Playing) {
                this.collision();
                if (this.player.radius >= this.radius) {
                    this.color = "#770000";
                }
                else {
                    this.color = "#FF0000";
                }
                // bounce on walls
                if (this.x + this.radius > this.limitX || this.x - this.radius < 0) {
                    this.dx = this.dx * -1;
                }
                // bounce on ceiling and floor
                if (this.y + this.radius > this.limitY || this.y - this.radius < 0) {
                    this.dy = this.dy * -1;
                }
                this.x += this.dx;
                this.y += this.dy;
            }
            else if (Game.Game.state === Game.GameState.PlayerLost) {
                this.radius += 1;
            }
        };
        return Enemy;
    }(Game.Circle));
    Game.Enemy = Enemy;
})(Game || (Game = {}));
var Game;
(function (Game_1) {
    var GameState;
    (function (GameState) {
        GameState[GameState["Playing"] = 0] = "Playing";
        GameState[GameState["PlayerWon"] = 1] = "PlayerWon";
        GameState[GameState["PlayerLost"] = 2] = "PlayerLost";
    })(GameState = Game_1.GameState || (Game_1.GameState = {}));
    var Game = /** @class */ (function () {
        function Game(ctx, width, height) {
            this.isStarted = false;
            this.intervalId = -1;
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.init(10);
        }
        Game.prototype.init = function (enemyCount) {
            var playerSize = 5;
            this.player = new Game_1.Player(10, this.width, this.height);
            this.enemys = new Array();
            for (var i = 1; i < enemyCount + 1; i++) {
                var size = playerSize * i;
                this.enemys.push(new Game_1.Enemy(Math.random() < 0.5 ? Math.floor(Math.random() * 3 + 1) : -Math.floor(Math.random() * 4 + 1), Math.random() < 0.5 ? Math.floor(Math.random() * 3 + 1) : -Math.floor(Math.random() * 4 + 1), Math.floor(size), this.width - size, Math.floor(Math.random() * (this.height - 2 * size) + size), this.width, this.height, this.player));
            }
            Game.state = GameState.Playing;
        };
        Game.prototype.start = function () {
            if (!this.isStarted) {
                this.isStarted = true;
                this.run();
            }
        };
        Game.prototype.stop = function () {
            if (!this.isStarted) {
                this.isStarted = false;
            }
        };
        Game.prototype.setMousePos = function (x, y) {
            this.player.mouseX = x;
            this.player.mouseY = y;
        };
        Game.prototype.reset = function () {
            this.init(10);
        };
        Game.prototype.run = function () {
            var _this = this;
            setTimeout(function () {
                _this.tick();
                _this.draw(_this.ctx);
                if (_this.isStarted) {
                    _this.run();
                }
            }, 10);
        };
        Game.prototype.tick = function () {
            this.enemys.forEach(function (enemy) {
                enemy.tick();
            });
            this.enemys = this.enemys.filter(function (enemy) {
                return enemy.radius > 0;
            });
            if (this.enemys.length === 0) {
                Game.state = GameState.PlayerWon;
            }
            this.player.tick();
        };
        Game.prototype.draw = function (ctx) {
            ctx.clearRect(0, 0, this.width, this.height);
            // draw background
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            this.player.draw(ctx);
            this.enemys.forEach(function (enemy) {
                enemy.draw(ctx);
            });
            if (Game.state === GameState.Playing) {
                ctx.font = "30px Consolas";
                ctx.fillStyle = "white";
                ctx.fillText(this.player.radius.toString(), 10, 30);
            }
            else if (Game.state === GameState.PlayerLost) {
                ctx.font = "30px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText("You lost!", this.width / 2 - 85, this.height / 2 - 50);
                ctx.fillText("Press [Space] to play again!", this.width / 2 - 225, this.height / 2 + 50);
            }
            else if (Game.state === GameState.PlayerWon) {
                ctx.font = "30px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText("Congrats, you Won!", this.width / 2 - 130, this.height / 2 - 50);
                ctx.fillText("Press [Space] to play again!", this.width / 2 - 225, this.height / 2 + 50);
            }
        };
        Game.state = GameState.Playing;
        return Game;
    }());
    Game_1.Game = Game;
})(Game || (Game = {}));
var Game;
(function (Game) {
    window.onload = function () {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var game = new Game.Game(ctx, canvas.width, canvas.height);
        window.addEventListener('mousemove', function (evt) {
            var rect = canvas.getBoundingClientRect();
            game.setMousePos((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width, (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
        }, false);
        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 32) {
                game.reset();
            }
        };
        game.start();
    };
})(Game || (Game = {}));
var Game;
(function (Game) {
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(radius, limitX, limitY) {
            var _this = _super.call(this, 100, 100, radius, "#00FF00") || this;
            _this.mouseX = _this.x;
            _this.mouseY = _this.y;
            _this.limitX = limitX;
            _this.limitY = limitY;
            _this.speed = 4;
            return _this;
        }
        Player.prototype.tick = function () {
            if (Game.Game.state === Game.GameState.Playing) {
                var dx = this.mouseX - (this.x);
                var dy = this.mouseY - (this.y);
                var d = Math.abs(dx) + Math.abs(dy);
                if (d > 2) {
                    this.x += this.speed * (dx / d);
                    this.y += this.speed * (dy / d);
                }
                if (this.radius <= 0) {
                    Game.Game.state = Game.GameState.PlayerLost;
                }
                if (this.x + this.radius > this.limitX) {
                    this.x = this.limitX - this.radius;
                }
                if (this.x - this.radius < 0) {
                    this.x = 0 + this.radius;
                }
                if (this.y + this.radius > this.limitY) {
                    this.y = this.limitY - this.radius;
                }
                if (this.y - this.radius < 0) {
                    this.y = 0 + this.radius;
                }
            }
            else if (Game.Game.state === Game.GameState.PlayerWon) {
                this.radius += 1;
            }
        };
        Player.prototype.draw = function (ctx) {
            // draw Mouse line
            ctx.beginPath();
            ctx.strokeStyle = "#AAAAAA";
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.mouseX, this.mouseY);
            ctx.stroke();
            _super.prototype.draw.call(this, ctx);
        };
        return Player;
    }(Game.Circle));
    Game.Player = Player;
})(Game || (Game = {}));
//# sourceMappingURL=game.js.map