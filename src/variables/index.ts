import {getArg} from '../utils/utils';
import {reader} from '../utils/reader';
import {pipe} from 'fp-ts/function';
import {apply, either} from 'fp-ts';

export const getVariable = pipe(
	reader.sequenceS({
		tgToken: getArg('TELEGRAM_TOKEN'),
		mongo: pipe(
			reader.sequenceS({
				host: getArg('MONGO_HOST'),
				password: getArg('MONGO_PASSWORD'),
				port: getArg('MONGO_PORT'),
				user: getArg('MONGO_USER'),
			}),
			reader.map(apply.sequenceS(either.Apply))
		),
	}),
	reader.map(apply.sequenceS(either.Apply))
);
