import {option} from 'fp-ts';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import {pipe} from 'fp-ts/function';
import {Option} from 'fp-ts/Option';

export const getArg = (process: NodeJS.Process, key: string): Option<string> => {
	const dotenvToken = option.fromNullable(process.env[key]);
	const argsToken = option.fromNullable(
		yargs(hideBin(process.argv))
			.options({[key]: {type: 'string'}})
			.parseSync()[key]
	);

	return pipe(
		argsToken,
		option.alt(() => dotenvToken)
	);
};
