import {Api, Bot, Context, RawApi, SessionFlavor} from 'grammy';
import {getStoragePlugin} from './storage';
import {reader} from '../utils/reader';
import {bot} from '../utils/bot/bot';
import {pipe} from 'fp-ts/function';

export interface SessionData {
	toSummon: string;
}

export type BotContext = Context & SessionFlavor<SessionData>;
export type AppBot = Bot<BotContext, Api<RawApi>>;

export const usePlugins = pipe(
	getStoragePlugin,
	reader.map((getStoragePlugin) => bot.use(getStoragePlugin<SessionData>({toSummon: ''})))
);
