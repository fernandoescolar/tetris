import Board from "../Board";
import Shape from "../Shape";

const L_Points = [
    [1, 0],
    [1, 0],
    [1, 1]
];

export default class L extends Shape {
    constructor(board: Board) {
        super(L_Points, '#073BFA', board);
    }
}