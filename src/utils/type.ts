// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FirstArg<F extends (...ars: Array<any>) => any> = Parameters<F>[0];

export type Func<A, B> = (value: A) => B;

export type Effect<A> = (a: A) => void;
