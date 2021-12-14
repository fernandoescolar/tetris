
export default class Board extends Array<Array<number>> {
    constructor(rows: number, cols: number) {
        super(rows);
        for (let i = 0; i < rows; i++) {
            this[i] = new Array(cols).fill(0);
        }
    }

    get lineHeight(): number {
        let height = this.length;
        for (let i = 0; i < this.length; i++) {
            if (this[i].every(x => x === 0)) {
                height--;
            }
        }

        return height;
    }

    /// hole = zero with 1 up
    /// 1
    /// 0
    ///
    ///  0 1 1
    ///
    ///  1 1 0
    ///
    ///  1 0 1
    get holes(): number {
        let holes = 0;
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this[i].length; j++) {
                if (this[i][j] === 0 && i > 0 && this[i - 1][j] === 1) {
                    holes++;
                    continue;
                }
                if (this[i][j] === 0 && j === 0 && this[i][j + 1] === 1 && this[i][j + 2] === 1) {
                    holes++;
                    continue;
                }
                if (this[i][j] === 0 && j === this[i].length - 1  && this[i][j - 1] === 1 && this[i][j - 2] === 1) {
                    holes++;
                    continue;
                }
                if (this[i][j] === 0 && j > 0 && this[i][j + 1] === 1 && this[i][j - 1] === 1) {
                    holes++;
                    continue;
                }
            }
        }

        return holes;
    }

    removeFullLines(): number {
        let removedRows = 0;
        for (let i = 0; i < this.length; i++) {
            const full = this[i].every(x => x === 1);
            if (full) {
                this.splice(i, 1);
                this.unshift((<any>Array(this[0].length)).fill(0));
                removedRows++;
            }
        }

        return removedRows;
    }

    copyShapeToBoard(row: number, col: number, points: number[][]) {
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[0].length; j++) {
                if (points[i][j] !== 1)
                    continue;
                this[row + i][col + j] = 1;
            }
        }
    }

    clone(): Board {
        var copy = new Board(this.length, this[0].length);
        for(let i = 0; i < this.length; i++) {
            copy[i] = this[i].slice();
        }

        return copy;
    }
}

