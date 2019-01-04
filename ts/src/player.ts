namespace Game {
    export class Player extends Circle {

        limitX: number;
        limitY: number;
        speed: number;

        mouseX: number;
        mouseY: number;

        constructor(radius: number, limitX: number, limitY: number) {
            super(100, 100, radius, "#00FF00");

            this.mouseX = this.x;
            this.mouseY = this.y;
            
            this.limitX = limitX;
            this.limitY = limitY;
            this.speed = 4;
        }

        public tick(): void {
            if (Game.state === GameState.Playing) {
                var dx = this.mouseX - (this.x);
                var dy = this.mouseY - (this.y);

                var d = Math.abs(dx) + Math.abs(dy);
                if (d > 2) {
                    this.x += this.speed * (dx / d);
                    this.y += this.speed * (dy / d);
                }

                if (this.radius <= 0) {
                    Game.state = GameState.PlayerLost;
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
            } else if (Game.state === GameState.PlayerWon) {
                this.radius += 1;
            }
        }

        public draw(ctx): void {

            // draw Mouse line
            ctx.beginPath();
            ctx.strokeStyle = "#AAAAAA";
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.mouseX, this.mouseY);
            ctx.stroke();

            super.draw(ctx);
        }

    }
}