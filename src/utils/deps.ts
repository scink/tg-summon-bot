import {Db} from 'mongodb';
import {StorageAdapter} from 'grammy';

export interface DatabaseDep {
	database: Db;
}
export interface TgTokenDep {
	tgToken: string;
}
export interface CollectionNameDep {
	collectionName: string;
}
export interface StorageAdapterDep<A> {
	storageAdapter: StorageAdapter<A>;
}
