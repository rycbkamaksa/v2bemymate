// страшная функция со stack overflow для ремаппинга
export type SpacedToSnake<T extends string, P extends string = ""> = string extends T ? string :
  T extends `${infer C0}${infer R}` ?
    SpacedToSnake<R, `${P}${C0 extends ' ' ? `_` : Lowercase<C0>}`> : P

export type RemapToSnakeKeys<T> = {
  [Key in keyof T as SpacedToSnake<string & Key>]: T[Key]
}
