import {CommandMiddleware, Middleware} from 'grammy/out/composer';
import {Bot as BotGrammy} from 'grammy';
import {TgTokenDep} from '../deps';
import {Effect} from '../type';
import {Filter, FilterQuery} from 'grammy/out/filter';
import {MaybeArray, StringWithSuggestions} from 'grammy/out/context';
import {ErrorHandler, PollingOptions} from 'grammy/out/bot';
import {AppBot, BotContext} from '../../plugins';

const create = ({tgToken}: TgTokenDep) => {
	console.log('bott.create');
	return new BotGrammy<BotContext>(tgToken);
};
const effect = (f: Effect<AppBot>) => (bot: AppBot) => {
	f(bot);
	return bot;
};

const use = (...middleware: Array<Middleware<BotContext>>) => effect((bot) => bot.use(...middleware));

const on = <Q extends FilterQuery>(filter: Q | Array<Q>, ...middleware: Array<Middleware<Filter<BotContext, Q>>>) =>
	effect((bot) => bot.on(filter, ...middleware));

const command = <S extends string>(
	command: MaybeArray<StringWithSuggestions<S | 'start' | 'help' | 'settings'>>,
	...middleware: Array<CommandMiddleware<BotContext>>
) => effect((bot) => bot.command(command, ...middleware));
const catchError = (errorHandler: ErrorHandler<BotContext>) => effect((bot) => bot.catch(errorHandler));
const start = (options?: PollingOptions) => effect((bot) => bot.start(options));

export const bot = {
	use,
	create,
	effect,
	on,
	command,
	catch: catchError,
	start,
};
