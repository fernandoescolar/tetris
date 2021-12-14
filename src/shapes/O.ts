import Board from "../Board";
import Shape from "../Shape";

const O_Points = [
    [1, 1],
    [1, 1]
];

export default class O extends Shape {
    constructor(board: Board) {
        super(O_Points, '#E3E306', board);
    }
}