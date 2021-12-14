import Board from "../Board";
import Shape from "../Shape";

const J_Points = [
    [0, 1],
    [0, 1],
    [1, 1]
];

export default class J extends Shape {
    constructor(board: Board) {
        super(J_Points, '#07D1FA', board);
    }
}