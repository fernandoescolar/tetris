import Board from "./Board";
import Shape from "./Shape";
import Tetris from "./Tetris";

export default class AI {
    private _current: Shape | null = null;
    private _currentRotation: number = 0;
    private _currentMovement!: Movement;

    constructor(
        private tetris: Tetris,
        private readonly linesFactor: number = 2,
        private readonly heightFactor: number = 0.1,
        private readonly holesFactor: number = 1) {
    }

    update() {
        if (!!this._current) this._doMovement();
        if (this._current === this.tetris.currentShape) return;

        this._current = this.tetris.currentShape;

        if (!this._current) return;
        this._currentRotation = 0;
        this._currentMovement = this._getNextMovement(this._current as Shape, this.tetris.board);
        console.log('Next movement:');
        console.log(this._currentMovement);
    }

    private _getNextMovement(current: Shape, board: Board): Movement {
        let movement: Movement = {
            weight: -99999999,
            rotation: 0,
            col: 0,
            row: 0
        };

        const s = current.clone();
        s.col = 0;
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < board[0].length; j++) {
                s.row = 0;
                const b = board.clone();
                while(!s.collision()) {
                    s.row++;
                }

                s.row--;
                b.copyShapeToBoard(s.row, s.col, s.points);
                const removedLines = b.removeFullLines();
                const height = b.lineHeight;
                const holes = b.holes;
                const weight = (removedLines * this.linesFactor) - (b.lineHeight * this.heightFactor) - (b.holes * this.holesFactor);
                b.forEach(line => {
                    console.log(line.join(' '));
                });
                console.log(`R: ${removedLines} H: ${height} X: ${holes}`);
                console.log(`W: ${weight}`);
                if (movement === undefined || weight > movement.weight) {
                    console.log(`!replaced: ${movement.weight}`);
                    movement = {
                        weight,
                        rotation: i,
                        col: j,
                        row: s.row
                    };
                }

                s.right();
            }

            s.col = 0;
            s.row = 0;
            s.rotateRight();
        }

        return movement;
    }

    private _doMovement() {
        if (!this._current) return;

        if (this._currentRotation !== this._currentMovement.rotation) {
            this._current.rotateRight();
            this._currentRotation++;
        }

        if (this._current.col > this._currentMovement.col) {
            this._current.left();
        }

        if (this._current.col < this._currentMovement.col) {
            this._current.right();
        }

        this._current._speed = 20;
    }
}

class Movement {
    constructor(
        public readonly row: number,
        public readonly col: number,
        public readonly rotation: number,
        public readonly weight: number
        ) {
    }
}