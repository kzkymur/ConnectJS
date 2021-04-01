type Vector = {
  x: number;
  y: number;
}
export default Vector;

export const add: (a: Vector, b: Vector) => Vector = (a, b) => ({ x: a.x+b.x, y: a.y+b.y });
export const subtract: (a: Vector, b: Vector) => Vector = (a, b) => ({ x: a.x-b.x, y: a.y-b.y });
