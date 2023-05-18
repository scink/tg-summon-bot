import {pipe} from 'fp-ts/function';
import {array, reader as readerFPTS} from 'fp-ts';
import {Reader as ReaderFPTS} from 'fp-ts/Reader';
import {FirstArg, UnionToIntersection} from './type';
import {combineReader, deferReader, sequenceTReader} from '@devexperts/utils/dist/adt/reader.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirstArgUnion<T extends (...ars: Array<any>) => any> = UnionToIntersection<NonNullable<FirstArg<T>>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReaderAny = Reader<any, any>;
type Sequenced<As extends {[K in keyof As]: ReaderAny}> = Reader<
	FirstArgUnion<As[keyof As]>,
	{[K in keyof As]: ReturnType<As[K]>}
>;

const sequenceS =
	<As extends Record<string, ReaderAny>>(as: As): Sequenced<As> =>
	(context) =>
		pipe(
			Object.entries(as as Record<string, ReaderAny>),
			array.reduce({} as ReturnType<Sequenced<As>>, (acc, [key, value]) => ({...acc, [key]: value(context)})),
		);

export type Reader<R, A> = ReaderFPTS<R, A>;
export const reader = {
	...readerFPTS,
	sequenceS,
	sequenceT: sequenceTReader,
	combine: combineReader,
	defer: deferReader,
};
