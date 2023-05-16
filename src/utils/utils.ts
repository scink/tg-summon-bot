import {either, option} from 'fp-ts';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import {pipe} from 'fp-ts/function';
import {Either} from 'fp-ts/Either';

export const getArg =
	(key: string) =>
	(process: NodeJS.Process): Either<Error, string> => {
		const dotenvVariable = option.fromNullable(process.env[key]);
		const argsVariable = option.fromNullable(
			yargs(hideBin(process.argv))
				.options({[key]: {type: 'string'}})
				.parseSync()[key]
		);

		return pipe(
			argsVariable,
			option.alt(() => dotenvVariable),
			either.fromOption(() => new Error(`Variable ${key} was not provided`))
		);
	};
