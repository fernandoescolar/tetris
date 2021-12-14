import AI from '../src/AI';
import Board from '../src/Board';
import Shape from '../src/Shape';
import Tetris from '../src/Tetris';

import { expect } from 'chai';
import IRenderer from '../src/IRenderer';

class DummyRenderer implements IRenderer {
    clear(): void {
    }
    drawGameover(): void {
    }
    drawBoard(): void {
    }
    drawShape(shape: Shape): void {
    }

}

describe('Options tests', () => { // the tests container
    it('checking default options', () => { // the single test
        const board = new Board(20, 10);
        board[18] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
        board[19] = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        const T_Points = [
            [1, 1, 1, 1]
        ];
        const t = new Shape(T_Points, '#05B00D', board);
        const tetris =  new Tetris(board, new DummyRenderer());
        (tetris as any)._currentShape = t;
        const ai = new AI(tetris as Tetris);

        ai.update();
    });
});