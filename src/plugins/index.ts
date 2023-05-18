import {Api, Bot, Context, RawApi, SessionFlavor} from 'grammy';
import {getStoragePlugin} from './storage';
import {reader} from '../utils/reader';
import {bot} from '../utils/bot';
import {ChatMembersFlavor} from '@grammyjs/chat-members';
import {getChatMembersPlugin} from './chat-members';
import {getStorageAdapter} from '../database/adapter';
import {ChatMember} from '@grammyjs/types';

export interface SummonObject {
	chatId: number;
	users: Array<string>;
}
export interface SessionData {
	toSummon: string;
	byChat: Array<SummonObject>;
}

export type BotContext = Context & SessionFlavor<SessionData> & ChatMembersFlavor;
export type AppBot = Bot<BotContext, Api<RawApi>>;

export const usePlugins = reader.combine(
	reader.defer(getStorageAdapter, 'collectionName'),
	reader.defer(getStoragePlugin<SessionData>(), 'storageAdapter'),
	reader.defer(getChatMembersPlugin, 'storageAdapter'),
	(getStorageAdapter, getStoragePlugin, getChatMembersPlugin) => {
		const sessionStorage = getStorageAdapter({collectionName: 'botData'})<SessionData>();
		const storagePlugin = getStoragePlugin({storageAdapter: sessionStorage})({toSummon: '', byChat: []});

		const chatMembersStorage = getStorageAdapter({collectionName: 'chatMember'})<ChatMember>();
		const chatMemberPlugin = getChatMembersPlugin({storageAdapter: chatMembersStorage});

		return bot.use(storagePlugin, chatMemberPlugin);
	},
);
