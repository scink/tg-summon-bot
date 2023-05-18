import {pipe} from 'fp-ts/function';
import {array} from 'fp-ts';

/**
 * Get props of the object
 *
 * @example
 * pipe({a: 'bal'}, pluck('a')) -> 'bal'
 * pipe({a: {b: 'bal'}}, pluck('a', 'b')) -> 'bal'
 */
export function pluck<O extends object, A extends keyof O>(a: A): (obj: O) => O[A];
export function pluck<O extends object, A extends keyof O, B extends keyof O[A]>(
	a: A,
	b: B,
): (obj: O) => O[A] extends object ? O[A][B] : never;
export function pluck<O extends object, A extends keyof O, B extends keyof O[A], C extends keyof O[A][B]>(
	a: A,
	b: B,
	c: C,
): (obj: O) => O[A][B] extends object ? O[A][B][C] : never;
export function pluck<
	O extends object,
	A extends keyof O,
	B extends keyof O[A],
	C extends keyof O[A][B],
	D extends keyof O[A][B][C],
>(a: A, b: B, c: C, d: D): (obj: O) => O[A][B][C] extends object ? O[A][B][C][D] : never;
export function pluck<
	O extends object,
	A extends keyof O,
	B extends keyof O[A],
	C extends keyof O[A][B],
	D extends keyof O[A][B][C],
	E extends keyof O[A][B][C][D],
>(a: A, b: B, c: C, d: D, e: E): (obj: O) => O[A][B][C][D] extends object ? O[A][B][C][D][E] : never;

export function pluck<O extends object>(...props: Array<string>) {
	return (obj: O) =>
		pipe(
			props,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			array.reduce(obj, (obj, key) => (obj as any)[key]),
		);
}
