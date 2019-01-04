var G;
(function (G) {
    var Game = /** @class */ (function () {
        function Game(ctx) {
            this.isStarted = false;
            this.intervalId = -1;
            this.ctx = ctx;
        }
        Game.prototype.init = function (enemys) {
        };
        Game.prototype.start = function () {
            if (!this.isStarted) {
                this.intervalId = setInterval(this.run, 10);
                this.isStarted = true;
            }
        };
        Game.prototype.stop = function () {
            if (!this.isStarted) {
                clearInterval(this.intervalId);
                this.isStarted = false;
            }
        };
        Game.prototype.run = function () {
            this.tick();
            this.draw(this.ctx);
        };
        Game.prototype.tick = function () {
        };
        Game.prototype.draw = function (ctx) {
        };
        return Game;
    }());
    G.Game = Game;
})(G || (G = {}));
//# sourceMappingURL=game.js.map