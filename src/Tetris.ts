import Shape from "./Shape";
import { shapes } from "./shapes";

export default class Tetris {
    private _fastSpeed = 40; // rows per second
    private _currentSpeed = 1; // rows per second
    private _squareSize = 20;
    private _squareLineWidth = 4;
    private _board: number[][];
    private _score: number = 0;
    private _currentShape: Shape | null = null;
    private _nextShape: Shape | null = null;
    private _gameOver: boolean = false;

    constructor(rows: number, cols: number, score: number = 0) {
        this._board = (<any>Array(rows)).fill(0).map(() => (<any>Array(cols)).fill(0));
        this._score = score;
    }

    public left(): void {
        if (this._currentShape) {
            this._currentShape.left(this._board);
        }
    }

    public right(): void {
        if (this._currentShape) {
            this._currentShape.right(this._board);
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
            this._currentShape.rotateRight(this._board);
        }
    }

    public rotateLeft(): void {
        if (this._currentShape) {
            this._currentShape.rotateLeft(this._board);
        }
    }

    public update(ticks: number) {
        if (!this._currentShape) {
            this._currentShape = this._nextShape || this._getRandomShape();
            this._nextShape = this._getRandomShape();
            return;
        }

        this._currentShape.update(ticks);

        if (this._currentShape.collision(this._board)) {
            if (this._currentShape.row === 0) {
                console.log('Game over!');
                this._gameOver = true;
                return;
            }
            this._copyShapeToBoard(this._currentShape.row - 1, this._currentShape.col, this._currentShape.points);
            this._currentShape = null;
            this._cleanBoard();
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const width = this._board[0].length * this._squareSize + this._squareLineWidth;
        const height = this._board.length * this._squareSize + this._squareLineWidth;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'green';
        ctx.fillText('Score: ' + this._score, 0, height + this._squareSize + this._squareSize / 2);

        ctx.save();

        if (this._gameOver) {
            ctx.fillStyle = 'red';
            ctx.fillText('Game over!', 0, height / 2);
            return;
        }

        ctx.shadowColor = 'black';
        ctx.fillStyle = '#639261';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this._squareLineWidth;
        ctx.shadowBlur = 3;
        for (let i = 0; i < this._board.length; i++) {
            for (let j = 0; j < this._board[0].length; j++) {
                if (this._board[i][j] === 1) {
                    ctx.shadowBlur = 3;
                    ctx.lineWidth = this._squareLineWidth;
                    ctx.fillRect(j * this._squareSize, i * this._squareSize, this._squareSize, this._squareSize);
                    ctx.strokeRect(j * this._squareSize, i * this._squareSize, this._squareSize, this._squareSize);
                } else {
                    ctx.shadowBlur = 0;
                    ctx.lineWidth = 0;
                    ctx.fillRect(j * this._squareSize + this._squareSize/4, i * this._squareSize + this._squareSize/4 , this._squareSize/2, this._squareSize/2);
                    ctx.strokeRect(j * this._squareSize + this._squareSize/4, i * this._squareSize + this._squareSize/4, this._squareSize/2, this._squareSize/2);
                }


            }
        }

        ctx.lineWidth = this._squareLineWidth;
        ctx.shadowBlur = 10;
        if (this._currentShape) {
            this._drawShape(this._currentShape, ctx);
        }

        if (this._nextShape) {
            ctx.fillText('Next', width + this._squareSize, this._squareSize);
            const temp = this._nextShape.col;
            this._nextShape.row = 2;
            this._nextShape.col = this._board[0].length + 2;
            this._drawShape(this._nextShape, ctx);
            this._nextShape.row = 0;
            this._nextShape.col = temp;
        }

        ctx.restore();
    }

    private _drawShape(shape: Shape, ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i <shape.points.length; i++) {
            for (let j = 0; j < shape.points[0].length; j++) {
                if (shape.points[i][j] !== 1)
                    continue;

                ctx.fillStyle = shape.color;
                ctx.fillRect((shape.col + j) * this._squareSize, (shape.row + i) * this._squareSize, this._squareSize, this._squareSize);
                ctx.strokeRect((shape.col + j) * this._squareSize, (shape.row + i) * this._squareSize, this._squareSize, this._squareSize);
            }
        }
    }

    private _cleanBoard(): void {
        for (let i = 0; i < this._board.length; i++) {
            const full = this._board[i].every(x => x === 1);
            if (full) {
                this._board.splice(i, 1);
                this._board.unshift((<any>Array(this._board[0].length)).fill(0));
                this._score++;
            }
        }
    }

    private _copyShapeToBoard(row: number, col: number, points: number[][]) {
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[0].length; j++) {
                if (points[i][j] !== 1)
                    continue;
                this._board[row + i][col + j] = 1;
            }
        }
    }

    private _getRandomShape() {
        let s = shapes[Math.floor(this._getRandom(0, shapes.length))];
        const points = s.points.map(arr => arr.slice());
        const shape = new Shape(points, s.color);
        shape.row = 0;
        shape.col = Math.floor((this._board[0].length - shape.points[0].length) / 2);

        return shape;
    }

    private _getRandom(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}
