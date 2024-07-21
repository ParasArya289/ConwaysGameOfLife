export function Create2DArray(cols, rows, randomize = false) {
  const arr = [];
  for (let i = 0; i < cols; i++) {
    arr[i] = Array.from(new Array(rows).fill(0), () =>
      randomize ? Math.floor(Math.random() > 0.8 ? 1 : 0) : 0,
    );
  }
  return arr;
}
export const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];
