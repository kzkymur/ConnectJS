type Vector = {
  x: number;
  y: number;
}
export default Vector;

export const add: (a: Vector, b: Vector) => Vector = (a, b) => ({ x: a.x+b.x, y: a.y+b.y });
export const subtract: (a: Vector, b: Vector) => Vector = (a, b) => ({ x: a.x-b.x, y: a.y-b.y });
export const multiply: (v: Vector, n: number) => Vector = (v, n) => ({ x: v.x * n, y: v.y * n });
export const dot: (a: Vector, b: Vector) => number = (a, b) => a.x * b.x + a.y * b.y;
export const hadamard: (a: Vector, b: Vector) => Vector = (a, b) => ({ x: a.x * b.x, y: a.y * b.y });
export const abs: (v: Vector) => Vector = v => ({ x: v.x>0 ? v.x : -1*v.x, y: v.y>0 ? v.y : -1*v.y });
export const signFilter: (v: Vector) => Vector = v => ({ x: v.x>0 ? 1 : -1, y: v.y>0 ? 1 : -1 });
export const len: (v: Vector) => number = v => Math.pow(Math.pow(v.x, 2) + Math.pow(v.y, 2), 0.5);
