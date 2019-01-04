namespace Game {

    export enum GameState {
        Playing,
        PlayerWon,
        PlayerLost
    }

    export class Game {

        public static state: GameState = GameState.Playing;

        ctx: CanvasRenderingContext2D;
        isStarted: boolean = false;
        intervalId: number = -1;

        width: number;
        height: number;

        player: Player;
        enemys: Array<Enemy>;

        constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.init(10);
        }

        public init(enemyCount: number) {
            let playerSize = 5;

            this.player = new Player(10, this.width, this.height);

            this.enemys = new Array<Enemy>();
            
            for (let i = 1; i < enemyCount + 1; i++) {
                let size = playerSize * i;
                this.enemys.push(new Enemy(
                    Math.random() < 0.5 ? Math.floor(Math.random() * 3 + 1) : -Math.floor(Math.random() * 4 + 1),
                    Math.random() < 0.5 ? Math.floor(Math.random() * 3 + 1) : -Math.floor(Math.random() * 4 + 1),
                    Math.floor(size),
                    this.width - size,
                    Math.floor(Math.random() * (this.height - 2 * size) + size),
                    this.width, this.height, this.player))
            }

            Game.state = GameState.Playing;
        }

        public start(): void {
            if (!this.isStarted) {
                this.isStarted = true;
                this.run();
            }
        }

        public stop(): void {
            if (!this.isStarted) {
                this.isStarted = false;
            }
        }

        public setMousePos(x: number, y: number) {
            this.player.mouseX = x;
            this.player.mouseY = y;
        }

        public reset() {
            this.init(10);
        }

        private run(): void {
            setTimeout(() => {

                this.tick();
                this.draw(this.ctx);

                if (this.isStarted) {
                    this.run()
                }

            }, 10);
        }

        private tick(): void {
            this.enemys.forEach((enemy) => {
                enemy.tick();
            });

            this.enemys = this.enemys.filter((enemy) => {
                return enemy.radius > 0;
            });

            if (this.enemys.length === 0) {
                Game.state = GameState.PlayerWon;
            }

            this.player.tick();
        }

        private draw(ctx: CanvasRenderingContext2D): void {
            ctx.clearRect(0, 0, this.width, this.height);

            // draw background
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);

            this.player.draw(ctx);

            this.enemys.forEach((enemy) => {
                enemy.draw(ctx);
            });

            if (Game.state === GameState.Playing) {
                ctx.font = "30px Consolas";
                ctx.fillStyle = "white";
                ctx.fillText(this.player.radius.toString(), 10, 30);
            } else if (Game.state === GameState.PlayerLost) {
                ctx.font = "30px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText("You lost!", this.width / 2 - 85, this.height / 2 - 50);
                ctx.fillText("Press [Space] to play again!", this.width / 2 - 225, this.height / 2 + 50);

            } else if (Game.state === GameState.PlayerWon) {
                ctx.font = "30px Consolas";
                ctx.fillStyle = "black";
                ctx.fillText("Congrats, you Won!", this.width / 2 - 130, this.height / 2 - 50);
                ctx.fillText("Press [Space] to play again!", this.width / 2 - 225, this.height / 2 + 50);

            }

        }
    }

}
