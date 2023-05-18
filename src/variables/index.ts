import {getArg} from '../utils/utils';
import {reader} from '../utils/reader';
import {pipe} from 'fp-ts/function';
import {apply, either} from 'fp-ts';

export const getVariable = pipe(
	reader.sequenceS({
		tgToken: getArg('TELEGRAM_TOKEN'),
		mongoUrl: getArg('MONGO_URL'),
		mongoDbName: getArg('MONGO_DB_NAME'),
	}),
	reader.map(apply.sequenceS(either.Apply)),
);
