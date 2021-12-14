import Board from "../Board";
import Shape from "../Shape";

const T_Points = [
    [1, 1, 1],
    [0, 1, 0]
];

export default class T extends Shape {
    constructor(board: Board) {
        super(T_Points, '#05B00D', board);
    }
}