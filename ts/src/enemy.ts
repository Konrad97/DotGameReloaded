namespace Game {

    export class Enemy extends Circle {
        dx: number;
        dy: number;
        limitX: number;
        limitY: number;
        player: Player;

        constructor(dx: number, dy: number, size: number, x: number, y: number, limitX: number, limitY: number, player: Player) {
            super(x, y, size, '#FF0000');
            this.dx = dx;
            this.dy = dy;
            this.limitX = limitX;
            this.limitY = limitY;
            this.player = player;
            this.color = "#FF0000";
        }

        collision(): void {
            var distance = Math.floor(Math.sqrt(Math.pow(this.player.x - this.x, 2) + Math.pow(this.player.y - this.y, 2)));
            if (distance < this.player.radius + this.radius) {
                var d = this.player.radius + this.radius - distance;
                if (this.player.radius >= this.radius) {
                    if (d < this.radius) {
                        this.player.radius += d;
                        this.radius -= d;
                    } else {
                        this.player.radius += this.radius;
                        this.radius = 0;
                    }
                }
                else {
                    if (d < this.player.radius) {
                        this.player.radius -= d;
                        this.radius += d;
                    } else {
                        this.radius += this.player.radius;
                        this.player.radius = 0;
                    }
                }
            }
        }

        tick(): void {
            if (Game.state === GameState.Playing) {

                this.collision();

                if (this.player.radius >= this.radius) {
                    this.color = "#770000";
                } else {
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
            } else if (Game.state === GameState.PlayerLost) {
                this.radius += 1;
            }
        }
    }
}