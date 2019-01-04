namespace G {
    export class Game {

        ctx: CanvasRenderingContext2D;
        isStarted: boolean = false;
        intervalId: number = -1;

        constructor(ctx: CanvasRenderingContext2D) {
            this.ctx = ctx;
        }

        public init(enemys: number) {

        }

        public start(): void {
            if (!this.isStarted) {
                this.intervalId = setInterval(this.run, 10);
                this.isStarted = true;
            }
        }

        public stop(): void {
            if (!this.isStarted) {
                clearInterval(this.intervalId);
                this.isStarted = false;
            }
        }

        private run(): void {
            this.tick();
            this.draw(this.ctx);
        }

        private tick(): void {

        }

        private draw(ctx: CanvasRenderingContext2D): void {

        }
    }

}
