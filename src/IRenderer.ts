import Shape from "./Shape";

export default interface IRenderer {
    clear(): void;
    drawGameover(): void;
    drawBoard(): void;
    drawShape(shape: Shape): void;
}