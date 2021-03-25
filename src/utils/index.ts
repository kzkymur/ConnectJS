export const px2n:(px:string) => number = (px: string) => Number(px.split('px')[0]); 

export type valueOf<T> = T[keyof T];

type Objs = { id: number; }[];
export const getIndex = (objs: Objs, id: number): number => {
  let i = -1;
  for (let baseIdRef of objs) {
    i++;
    if (baseIdRef.id === id) return i;
  }
  return -1;
}

export type Vector = {
  x: number;
  y: number;
}
