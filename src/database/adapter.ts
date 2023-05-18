import {ISession, MongoDBAdapter} from '@grammyjs/storage-mongodb';
import {CollectionNameDep, DatabaseDep} from '../utils/deps';

export const getStorageAdapter =
	({database, collectionName}: DatabaseDep & CollectionNameDep) =>
	<A>() =>
		new MongoDBAdapter<A>({collection: database.collection<ISession>(collectionName)});
