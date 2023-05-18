import {Option} from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';
import {array as arrayFPTS, option} from 'fp-ts';
import {NonEmptyArray} from 'fp-ts/NonEmptyArray';
import {Eq} from 'fp-ts/Eq';
import {Predicate} from 'fp-ts/Predicate';
import {Func} from './type';

const upsert =
	<A>(p: Predicate<A>, a: A) =>
	(as: Array<A>): NonEmptyArray<A> =>
		pipe(
			as,
			arrayFPTS.findIndex(p),
			option.chain((index) => arrayFPTS.modifyAt(index, () => a)(as) as Option<NonEmptyArray<A>>),
			option.getOrElse(() => arrayFPTS.append(a)(as)),
		);
const upsertEq = <A>(eq: Eq<A>, a: A): Func<Array<A>, NonEmptyArray<A>> => upsert((_a) => eq.equals(_a, a), a);
const removeFirst =
	<A>(p: Predicate<A>) =>
	(as: Array<A>): Array<A> =>
		pipe(
			as,
			arrayFPTS.findIndex(p),
			option.chain((i) => arrayFPTS.deleteAt(i)(as)),
			option.getOrElse(() => as),
		);

export const array = {
	...arrayFPTS,
	upsert,
	upsertEq,
	removeFirst,
};
