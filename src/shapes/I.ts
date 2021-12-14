import Board from "../Board";
import Shape from "../Shape";

const I_Points = [
    [1, 1, 1, 1]
];

export default class I extends Shape {
    constructor(board: Board) {
        super(I_Points, '#FA07A9', board);
    }
}