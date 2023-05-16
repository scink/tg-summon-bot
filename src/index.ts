import {getVariable} from './variables';
import dotenv from 'dotenv';
import {pipe} from 'fp-ts/function';
import {taskEither} from 'fp-ts';
import {database} from './database';
import {runUnsafe} from './utils/run-task';
import {botInstance} from './bot-instance';

dotenv.config();
dotenv.config({path: '.env.local', override: true});

const botWithDeps = pipe(
	getVariable(process),
	taskEither.fromEither,
	taskEither.chain(({mongoUrl, tgToken}) => {
		console.log(`telegram token is ${tgToken}`);
		console.log(`mongo url is ${mongoUrl}`);
		return pipe(
			database.create(mongoUrl, 'botDB'),
			taskEither.map((database) => ({database, tgToken}))
		);
	}),
	taskEither.map(botInstance)
);

runUnsafe(botWithDeps);
