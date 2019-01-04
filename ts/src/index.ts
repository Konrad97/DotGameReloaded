namespace Game {
    window.onload = () => {


        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        let game: Game = new Game(ctx, canvas.width, canvas.height);

        window.addEventListener('mousemove', evt => {
            var rect = canvas.getBoundingClientRect();
            game.setMousePos(
                (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
                (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
            );
        }, false)

        window.onkeyup = function (e) {

            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 32) {
                game.reset();
            }

        }

        game.start();

    }
}

