

class Shape {
    public row: number = 0;
    public col: number = 0;
    public _speed: number = 1; // rows per second
    private _delta: number = 0;

    constructor(public points: number[][], readonly color: string) {
    }

    setSpeed(rowsPerSecond: number) {
        this._delta = 0;
        this._speed = rowsPerSecond;
    }

    update(ticks: number): void {
        if (this.row < 0) return;

        const alpha = 1000 / this._speed;
        this._delta += ticks;
        while (this._delta >= alpha) {
            this._delta -= alpha;
            this.row += 1;
        }
    }

    collision(board: number[][]): boolean {
        for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < this.points[0].length; j++) {
                if (this.points[i][j] !== 1) continue;

                if (this.row + i >= board.length) {
                    return true;
                }

                if (board[this.row + i][this.col + j] === 1) {
                    return true;
                }
            }
        }

        return false;
    }

    left(): void {
        this.col--;
        if (this.col < 0) {
            this.col = 0;
        }
    }

    right(boardWidth: number): void {
        this.col++;
        if (this.col + this.points[0].length > boardWidth) {
            this.col = boardWidth - this.points[0].length;
        }
    }


    /// 1 2 3     4 1    00 01 02    10 00
    /// 4 5 6  => 5 2    10 11 12 => 11 01
    ///           6 3                12 02
    rotateRight(): void {
        const newPoints = [];
        for (let i = 0; i < this.points.length; i++) {
            newPoints[i] = [];
            for (let j = 0; j < this.points[0].length; j++) {
                newPoints[this.points[0].length - 1 - j][i] = this.points[i][j];
            }
        }

        this.points = newPoints;
    }

    /// 1 2 3    3 6
    /// 4 5 6 => 2 5
    ///          1 4
    rotateLeft(): void {
        const newPoints = [];
        for (let i = this.points[0].length - 1; i >= 0; i--) {
            newPoints[i] = [];
            for (let j = 0; j < this.points.length; j++) {
                newPoints[i][j] = this.points[j][i];
            }
        }

        this.points = newPoints;
    }
}

const shapes: Shape[] = [
    new Shape([
        [1, 1],
        [1, 1]], 'red'),
    new Shape([
        [1, 1, 0],
        [0, 1, 1]], 'red'),
    new Shape([
        [0, 1, 1],
        [1, 1, 0]], 'red'),
    new Shape([
        [1, 1, 1, 1],
        [0, 0, 0, 0]], 'red'),
    new Shape([
        [1, 1],
        [1, 0],
        [1, 0]], 'red'),
    new Shape([
        [1, 1],
        [0, 1],
        [0, 1]], 'red'),
    new Shape([
        [1, 1, 1],
        [0, 1, 0]], 'red'),
];

class Tetris {
    private _fastSpeed = 15; // rows per second
    private _currentSpeed = 1; // rows per second
    private _board: number[][];
    private _score: number = 0;
    private _currentShape: Shape;

    constructor(rows: number, cols: number, score: number = 0) {
        this._board = (<any>Array(rows)).fill(0).map(() => (<any>Array(cols)).fill(0));
        this._score = score;
    }

    public left(): void {
        if (this._currentShape) {
            this._currentShape.left();
        }
    }

    public right(): void {
        if (this._currentShape) {
            this._currentShape.right(this._board[0].length);
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

    public update(ticks) {
        if (!this._currentShape) {
            this._currentShape = this._getRandomShape();
            return;
        }

        this._currentShape.update(ticks);

        if (this._currentShape.collision(this._board)) {
            this._copyShapeToBoard(this._currentShape.row - 1, this._currentShape.col, this._currentShape.points);
            this._currentShape = null;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const width = this._board[0].length * 10;
        const height = this._board.length * 10;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';

        for (let i = 0; i < this._board.length; i++) {
            for (let j = 0; j < this._board[0].length; j++) {
                if (this._board[i][j] !== 1) continue;

                ctx.fillRect(j * 10, i * 10, 10, 10);
            }
        }

        if (this._currentShape) {
            for (let i = 0; i < this._currentShape.points.length; i++) {
                for (let j = 0; j < this._currentShape.points[0].length; j++) {
                    if (this._currentShape.points[i][j] !== 1) continue;

                    ctx.fillStyle = this._currentShape.color;
                    ctx.fillRect((this._currentShape.col + j) * 10, (this._currentShape.row + i) * 10, 10, 10);
                }
            }
        }
    }

    private _copyShapeToBoard(row: number, col: number, points: number[][]) {
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[0].length; j++) {
                if (points[i][j] !== 1) continue;
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

    private _getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
}

class Game {
    private _tetris: Tetris;
    private _ctx: CanvasRenderingContext2D;
    private _last: Date;
    private _active: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this._ctx = canvas.getContext('2d');
        this._tetris = new Tetris(20, 10, 0);
    }

    public start() {
        this._active = true;
        window.requestAnimationFrame(() => this._step());
        window.addEventListener('keydown', this._keyDown.bind(this));
        window.addEventListener('keyup', this._keyUp.bind(this));
    }

    private _step() {
        const now = new Date();
        if (this._last) {
            var ticks = now.getTime() - this._last.getTime();
            this._tetris.update(ticks);
        }

        this._last = now;
        this._draw();

        if (this._active) {
            window.requestAnimationFrame(() => this._step());
        }
    }

    private _draw() {
        this._tetris.draw(this._ctx);
    }

    private _keyDown(e: KeyboardEvent) {
        if (e.keyCode === 37) {
            this._tetris.left();
        } else if (e.keyCode === 39) {
            this._tetris.right();
        } else if (e.keyCode === 40) {
            this._tetris.down();
        } else if (e.keyCode === 38) {
            this._tetris.rotateRight();
        } else if (e.keyCode === 17) { // ctrl
            this._tetris.rotateRight();
        } else if (e.keyCode === 18) { // alt gr
            this._tetris.rotateLeft();
        }
    }

    private _keyUp(e: KeyboardEvent) {
        if (e.keyCode === 40) {
            this._tetris.stopDown();
        }
    }
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const game = new Game(canvas);
game.start();