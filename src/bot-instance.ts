import {usePlugins} from './plugins';
import {flow, pipe} from 'fp-ts/function';
import {reader} from './utils/reader';
import {addStartFunction} from './functions/start';
import {addSummonFunction} from './functions/summon';
import {bot} from './utils/bot';

const addFunctions = flow(addSummonFunction, addStartFunction);

export const botInstance = reader.combine(bot.create, usePlugins, (bot, usePlugins) =>
	pipe(bot, usePlugins, addFunctions),
);
