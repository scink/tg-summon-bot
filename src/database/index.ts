import {taskEither} from 'fp-ts';
import {Db, DbOptions, MongoClient} from 'mongodb';
import {pipe} from 'fp-ts/function';
import {Document} from 'bson';
import {memoize} from '../utils/function';

//region internal
const createClient = memoize((url: string) => new MongoClient(url));
const connect = (client: MongoClient) =>
	taskEither.tryCatch(
		() => client.connect(),
		() => new Error('Could not connect to database')
	);
const createDatabase = (name: string, options?: DbOptions) => (client: MongoClient) => client.db(name, options);
//endregion

const create = (url: string, dbName: string, options?: DbOptions) =>
	pipe(createClient(url), connect, taskEither.map(createDatabase(dbName, options)));

//TODO: add io-ts check
const collection =
	<Schema extends Document = Document>(name: string) =>
	(db: Db) =>
		db.collection<Schema>(name);

export const database = {
	create,
	collection,
};
