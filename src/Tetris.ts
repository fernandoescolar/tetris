import Board from "./Board";
import IRenderer from "./IRenderer";
import Shape from "./Shape";
import { shapes } from "./shapes";

export default class Tetris {
    private _fastSpeed = 40; // rows per second
    private _currentSpeed = 1; // rows per second
    private _score: number = 0;
    private _currentShape: Shape | null = null;
    private _nextShape: Shape | null = null;
    private _gameOver: boolean = false;

    constructor(private readonly board: Board, private readonly renderer: IRenderer) {
    }

    public left(): void {
        if (this._currentShape) {
            this._currentShape.left();
        }
    }

    public right(): void {
        if (this._currentShape) {
            this._currentShape.right();
        }
    }

    public down(): void {
        if (this._currentShape) {
            this._currentShape.setSpeed(this._fastSpeed);
        }
    }

    public stopDown(): void {
        if (this._currentShape) {
            this._currentShape.setSpeed(this._currentSpeed);
        }
    }

    public rotateRight(): void {
        if (this._currentShape) {
            this._currentShape.rotateRight();
        }
    }

    public rotateLeft(): void {
        if (this._currentShape) {
            this._currentShape.rotateLeft();
        }
    }

    public update(ticks: number) {
        if (!this._currentShape) {
            this._currentShape = this._nextShape || this._getRandomShape();
            this._nextShape = this._getRandomShape();
            return;
        }

        this._currentShape.update(ticks);

        if (this._currentShape.collision()) {
            if (this._currentShape.row === 0) {
                console.log('Game over!');
                this._gameOver = true;
                return;
            }
            this._currentShape.copyToBoard();
            this._currentShape = null;
            this._score += this.board.removeFullLines();
        }
    }

    public draw() {
        this.renderer.clear();
        if (this._gameOver) {
            this.renderer.drawGameover();
            return;
        }

        this.renderer.drawBoard();
        if (this._currentShape) {
            this.renderer.drawShape(this._currentShape);
        }

        if (this._nextShape) {
            const temp = this._nextShape.col;
            this._nextShape.row = 2;
            this._nextShape.col = this.board[0].length + 2;
            this.renderer.drawShape(this._nextShape);
            this._nextShape.row = 0;
            this._nextShape.col = temp;
        }
    }

    private _getRandomShape() {
        let type = shapes[Math.floor(this._getRandom(0, shapes.length))];
        return new type(this.board);
    }

    private _getRandom(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}
