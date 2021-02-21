export const px2n:(px:string) => number = (px: string) => Number(px.split('px')[0]); 

export type valueOf<T> = T[keyof T];
