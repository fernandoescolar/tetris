import Board from "../Board";
import Shape from "../Shape";

const Z_Points = [
    [1, 1, 0],
    [0, 1, 1]
];

export default class Z extends Shape {
    constructor(board: Board) {
        super(Z_Points, '#F93505', board);
    }
}