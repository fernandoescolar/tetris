import Board from "./Board";

export default class Shape {
    public row: number = 0;
    public col: number = 0;
    public _speed: number = 1; // rows per second
    private _delta: number = 0;

    constructor(public points: number[][], readonly color: string, private readonly board: Board) {
        this.row = 0;
        this.col = Math.floor((this.board[0].length - this.points[0].length) / 2);
    }

    setSpeed(rowsPerSecond: number) {
        this._delta = 0;
        this._speed = rowsPerSecond;
    }

    update(ticks: number): void {
        if (this.row < 0)
            return;

        const alpha = 1000 / this._speed;
        this._delta += ticks;
        while (this._delta >= alpha) {
            this._delta -= alpha;
            this.row += 1;
        }
    }

    collision(): boolean {
        return Shape._collision(this.row, this.col, this.points, this.board);
    }

    left(): void {
        if (Shape._collision(this.row, this.col - 1, this.points, this.board)){
            return;
        }

        this.col--;
        if (this.col < 0) {
            this.col = 0;
        }
    }

    right(): void {
        if (Shape._collision(this.row, this.col + 1, this.points, this.board)){
            return;
        }

        this.col++;
        if (this.col + this.points[0].length > this.board[0].length) {
            this.col = this.board[0].length - this.points[0].length;
        }
    }


    /// 1 2 3     4 1    00 01 02    10(00) 00(01)
    /// 4 5 6  => 5 2    10 11 12 => 11(10) 01(11)
    ///           6 3                12(20) 02(21)
    rotateRight(): void {
        if (this.col + this.points.length > this.board[0].length) {
            return;
        }

        const newPoints = (<any>Array(this.points[0].length)).fill(0).map(() => (<any>Array(this.points.length)).fill(0));
        for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < this.points[0].length; j++) {
                newPoints[j][this.points.length - 1 - i] = this.points[i][j];
            }
        }

        if (!Shape._collision(this.row, this.col, newPoints, this.board)) {
            this.points = newPoints;
        }
    }

    /// 1 2 3    3 6   00 01 02    02(00) 12(01)
    /// 4 5 6 => 2 5   10 11 12 => 01(10) 11(11)
    ///          1 4               00(20) 10(21)
    rotateLeft(): void {
        if (this.col + this.points.length > this.board[0].length) {
            return;
        }

        const newPoints = (<any>Array(this.points[0].length)).fill(0).map(() => (<any>Array(this.points.length)).fill(0));
        for (let i = 0; i < this.points.length; i++) {
            for (let j = 0; j < this.points[0].length; j++) {
                newPoints[this.points[0].length - 1 - j][i] = this.points[i][j];
            }
        }

        if (!Shape._collision(this.row, this.col, newPoints, this.board)) {
            this.points = newPoints;
        }
    }

    copyToBoard(): void {
        this.board.copyShapeToBoard(this.row - 1, this.col, this.points);
    }

    clone() : Shape {
        const points = this.points.map(arr => arr.slice());
        const copy = new Shape(points, this.color, this.board);
        copy.row = this.row;
        copy.col = this.col;
        copy._speed = this._speed;
        return copy;
    }

    private static _collision(row: number, col:number, points: number[][], board: number[][]): boolean {
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[0].length; j++) {
                if (points[i][j] !== 1)
                    continue;

                if (row + i >= board.length) {
                    return true;
                }

                if (board[row + i][col + j] === 1) {
                    return true;
                }
            }
        }

        return false;
    }
}
