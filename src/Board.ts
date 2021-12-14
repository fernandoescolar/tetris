
export default class Board extends Array<Array<number>> {
    constructor(rows: number, cols: number) {
        super(rows);
        for (let i = 0; i < rows; i++) {
            this[i] = new Array(cols).fill(0);
        }
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
}

