// copypasted from fp-ts@1
// https://github.com/gcanti/fp-ts/blob/1.x/src/function.ts#L390

const concat = <A>(a: Array<A>, b: Array<A>): Array<A> => {
	const lenx = a.length;
	if (lenx === 0) {
		return b;
	}
	const leny = b.length;
	if (leny === 0) {
		return a;
	}
	const r = Array(lenx + leny);
	for (let i = 0; i < lenx; i++) {
		r[i] = a[i];
	}
	for (let i = 0; i < leny; i++) {
		r[i + lenx] = b[i];
	}
	return r;
};

type Function2<A, B, C> = (a: A, b: B) => C;
type Function3<A, B, C, D> = (a: A, b: B, c: C) => D;
type Function4<A, B, C, D, E> = (a: A, b: B, c: C, d: D) => E;
type Function5<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E) => F;
type Function6<A, B, C, D, E, F, G> = (a: A, b: B, c: C, d: D, e: E, f: F) => G;
type Function7<A, B, C, D, E, F, G, H> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H;
type Function8<A, B, C, D, E, F, G, H, I> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I;
type Function9<A, B, C, D, E, F, G, H, I, J> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => J;

type Curried2<A, B, C> = (a: A) => (b: B) => C;
type Curried3<A, B, C, D> = (a: A) => (b: B) => (c: C) => D;
type Curried4<A, B, C, D, E> = (a: A) => (b: B) => (c: C) => (d: D) => E;
type Curried5<A, B, C, D, E, F> = (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F;
type Curried6<A, B, C, D, E, F, G> = (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => G;
type Curried7<A, B, C, D, E, F, G, H> = (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => H;
type Curried8<A, B, C, D, E, F, G, H, I> = (
	a: A,
) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => (h: H) => I;
type Curried9<A, B, C, D, E, F, G, H, I, J> = (
	a: A,
) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => (h: H) => (i: I) => J;

function curried(f: Function, n: number, acc: Array<unknown>) {
	return function (this: unknown, a: unknown) {
		const combined = concat(acc, [a]);

		return n === 0 ? f.apply(this, combined) : curried(f, n - 1, combined);
	};
}

export function curry<A, B, C>(f: Function2<A, B, C>): Curried2<A, B, C>;
export function curry<A, B, C, D>(f: Function3<A, B, C, D>): Curried3<A, B, C, D>;
export function curry<A, B, C, D, E>(f: Function4<A, B, C, D, E>): Curried4<A, B, C, D, E>;
export function curry<A, B, C, D, E, F>(f: Function5<A, B, C, D, E, F>): Curried5<A, B, C, D, E, F>;
export function curry<A, B, C, D, E, F, G>(f: Function6<A, B, C, D, E, F, G>): Curried6<A, B, C, D, E, F, G>;
export function curry<A, B, C, D, E, F, G, H>(f: Function7<A, B, C, D, E, F, G, H>): Curried7<A, B, C, D, E, F, G, H>;
export function curry<A, B, C, D, E, F, G, H, I>(
	f: Function8<A, B, C, D, E, F, G, H, I>,
): Curried8<A, B, C, D, E, F, G, H, I>;
export function curry<A, B, C, D, E, F, G, H, I, J>(
	f: Function9<A, B, C, D, E, F, G, H, I, J>,
): Curried9<A, B, C, D, E, F, G, H, I, J>;

export function curry(f: Function) {
	return curried(f, f.length - 1, []);
}
