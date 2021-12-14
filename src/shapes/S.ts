import Board from "../Board";
import Shape from "../Shape";

const S_Points = [
    [0, 1, 1],
    [1, 1, 0]
];

export default class S extends Shape {
    constructor(board: Board) {
        super(S_Points, '#A2FA07', board);
    }
}