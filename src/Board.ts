
export default class Board extends Array<Array<number>> {
    constructor(rows: number, cols: number) {
        super(rows);
        for (let i = 0; i < rows; i++) {
            this[i] = new Array(cols).fill(0);
        }
    }

    get heights(): number[] {
        let heights: number[] = [];
        for (let j = 0; j < this[0].length; j++) {
            for (let i = 0; i < this.length; i++) {
                if (this[i][j] === 1) {
                    heights.push(this.length - i);
                    break;
                }
            }

            if (heights.length < j + 1) {
                heights.push(0);
            }
        }

        return heights;
    }

    get height(): number {
        let height = 0;
        this.heights.forEach(h => height += h);
        return height;
    }

    get holes(): number {
        let holes = 0;
        for (let j = 0; j < this[0].length; j++) {
            let count = false;
            for (let i = 0; i < this.length; i++) {
                if (this[i][j] === 1) {
                    count = true;
                }
                if (this[i][j] === 0 && count) {
                    holes++;
                }
            }
        }

        return holes;
    }

    get bumpiness(): number {
        const heights = this.heights;
        let bumpiness = 0;
        for (let i = 1; i < heights.length; i++) {
            bumpiness += Math.abs(heights[i - 1] - heights[i]);
        }

        return bumpiness;
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

