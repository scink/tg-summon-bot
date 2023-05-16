import {Func} from './type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoize = <F extends Func<any, any>>(f: F): F => {
	const memory = new Map<string, ReturnType<F>>();
	return ((...args: Parameters<F>) => {
		const key = args.toString();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const res = (f as any)(...args) as ReturnType<F>;

		if (!memory.has(key)) {
			memory.set(key, res);
		}
		return memory.get(key) || res;
	}) as F;
};
