import { add, subtract, multiply, dot, abs, signFilter, len } from '@/utils/vector';

test('vector test', () => {
  const a = { x: 2, y: 1 }, b = { x: -3, y: 4 };
  expect(add(a, b)).toStrictEqual({ x: -1, y: 5 });
  expect(subtract(a, b)).toStrictEqual({ x: 5, y: -3 });
  expect(multiply(a, 2)).toStrictEqual({ x: 4, y: 2 });
  expect(dot(a, b)).toBe(-2);
  expect(abs(b)).toStrictEqual({ x: 3, y: 4 });
  expect(signFilter(b)).toStrictEqual({ x: -1, y: 1 });
  expect(len(b)).toBe(5);
})
