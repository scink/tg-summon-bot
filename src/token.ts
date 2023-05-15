import dotenv from 'dotenv';
import {option} from 'fp-ts';
import {getArg} from './utils';

dotenv.config();
dotenv.config({path: '.env.local', override: true});

const token = getArg(process, 'TELEGRAM_TOKEN');

if (option.isNone(token)) {
	throw new Error('Provide the token!');
}

export const TELEGRAM_TOKEN = token.value;
