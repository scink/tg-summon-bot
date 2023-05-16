import {Db} from 'mongodb';

export interface DatabaseDep {
	database: Db;
}
export interface TgTokenDep {
	tgToken: string;
}
