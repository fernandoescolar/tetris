import Board from "./Board";
import CanvasRenderer from "./CanvasRenderer";
import Tetris from "./Tetris";

export default class Game {
    private _board: Board;
    private _tetris: Tetris;
    private _last: Date | null = null;
    private _active: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this._board = new Board(20, 10);
        this._tetris = new Tetris(this._board, new CanvasRenderer(canvas, this._board));
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
        this._tetris.draw();
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
        } else if (e.keyCode === 65) { // A
            this._tetris.rotateLeft();
        } else if (e.keyCode === 83) { // S
            this._tetris.rotateRight();
        }
    }

    private _keyUp(e: KeyboardEvent) {
        if (e.keyCode === 40) {
            this._tetris.stopDown();
        }
    }
}
