import IRenderer from "./IRenderer";
import Shape from "./Shape";

export default class CanvasRenderer implements IRenderer {
    private static readonly SquareSize = 20;
    private static readonly SquareLineWidth = 4;
    private static readonly BgColor = 'black';
    private static readonly BoardColor = '#639261';
    private static readonly GameoverColor = 'red';
    private static readonly GameoverText = 'Game over!';

    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _board: number[][];
    private readonly _width: number;
    private readonly _height: number;

    constructor(canvas: HTMLCanvasElement, board: number[][]) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this._board = board;
        this._width = this._board[0].length * CanvasRenderer.SquareSize + CanvasRenderer.SquareLineWidth;
        this._height = this._board.length * CanvasRenderer.SquareSize + CanvasRenderer.SquareLineWidth;
    }

    clear(): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.fillStyle = CanvasRenderer.BgColor;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        //this._ctx.fillStyle = 'green';
        //this._ctx.fillText('Score: ' + this._score, 0, height + this._squareSize + this._squareSize / 2);
    }

    drawGameover(): void {
        this._ctx.fillStyle = CanvasRenderer.GameoverColor;
        this._ctx.fillText(CanvasRenderer.GameoverText, 0, this._height / 2);
    }

    drawBoard(): void {
        for (let i = 0; i < this._board.length; i++) {
            for (let j = 0; j < this._board[0].length; j++) {
                if (this._board[i][j] === 1) {
                    this.drawPoint(i, j, CanvasRenderer.BoardColor);
                } else {
                    this.drawEmptyPoint(i, j, CanvasRenderer.BoardColor);
                }
            }
        }
    }

    drawShape(shape: Shape): void {
        for (let i = 0; i <shape.points.length; i++) {
            for (let j = 0; j < shape.points[0].length; j++) {
                if (shape.points[i][j] !== 1)
                    continue;

                this.drawPoint(shape.row + i, shape.col + j, shape.color);
            }
        }
    }

    private drawPoint(row: number, col: number, color: string): void {
        this._ctx.fillStyle = color;
        this._ctx.shadowColor = CanvasRenderer.BgColor;
        this._ctx.strokeStyle = CanvasRenderer.BgColor;
        this._ctx.shadowBlur = 3;
        this._ctx.lineWidth = CanvasRenderer.SquareLineWidth;
        this._ctx.fillRect(col * CanvasRenderer.SquareSize, row * CanvasRenderer.SquareSize, CanvasRenderer.SquareSize, CanvasRenderer.SquareSize);
        this._ctx.strokeRect(col * CanvasRenderer.SquareSize, row * CanvasRenderer.SquareSize, CanvasRenderer.SquareSize, CanvasRenderer.SquareSize);
    }

    private drawEmptyPoint(row: number, col: number, color: string): void {
        this._ctx.fillStyle = color;
        this._ctx.shadowColor = CanvasRenderer.BgColor;
        this._ctx.strokeStyle = CanvasRenderer.BgColor;
        this._ctx.shadowBlur = 0;
        this._ctx.lineWidth = 0;
        this._ctx.fillRect(col * CanvasRenderer.SquareSize + CanvasRenderer.SquareSize/4, row * CanvasRenderer.SquareSize + CanvasRenderer.SquareSize/4 , CanvasRenderer.SquareSize/2, CanvasRenderer.SquareSize/2);
        this._ctx.strokeRect(col * CanvasRenderer.SquareSize + CanvasRenderer.SquareSize/4, row * CanvasRenderer.SquareSize + CanvasRenderer.SquareSize/4, CanvasRenderer.SquareSize/2, CanvasRenderer.SquareSize/2);
    }
}