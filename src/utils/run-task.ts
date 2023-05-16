import {Either} from 'fp-ts/Either';
import {either} from 'fp-ts';
import {identity} from 'fp-ts/function';
import {TaskEither} from 'fp-ts/TaskEither';

const rethrow = (e: unknown): never => {
	throw e;
};
const getUnsafe: <A>(ea: Either<unknown, A>) => A = either.fold(rethrow, identity);
const terminateUnsafe = (e: unknown) => {
	console.error(e);
	process.exit(1);
};

export const runUnsafe = (task: TaskEither<unknown, unknown>): void => {
	task().then(getUnsafe).catch(terminateUnsafe);
};
