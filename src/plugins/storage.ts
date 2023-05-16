import {session} from 'grammy';
import {ISession, MongoDBAdapter} from '@grammyjs/storage-mongodb/dist/esm/mod';
import {DatabaseDep} from '../utils/deps';
import {BotContext} from './index';

//TODO: add io-ts check
export const getStoragePlugin =
	({database}: DatabaseDep) =>
	<A>(initial: A) =>
		session<A, BotContext>({
			initial: () => initial,
			storage: new MongoDBAdapter<A>({collection: database.collection<ISession>('botData')}),
		});
