import {session} from 'grammy';
import {StorageAdapterDep} from '../utils/deps';
import {BotContext} from './index';

//TODO: add io-ts check
export const getStoragePlugin =
	<A>() =>
	({storageAdapter}: StorageAdapterDep<A>) =>
	(initial: A) =>
		session<A, BotContext>({initial: () => initial, storage: storageAdapter});
