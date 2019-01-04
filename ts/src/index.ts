import { Game } from "./game";

window.onload = () => {

    
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let game: GameModule.Game = new GameModule.Game(ctx);

}