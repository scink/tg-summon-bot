import dotenv from 'dotenv';
import {Bot as BotGrammy} from 'grammy/out/bot';
import {MongoClient} from 'mongodb';
import {Context, session, SessionFlavor} from 'grammy';
import {ISession, MongoDBAdapter} from '@grammyjs/storage-mongodb/dist/esm/mod';

dotenv.config();
dotenv.config({path: '.env.local', override: true});

const tgToken = process.env['TELEGRAM_TOKEN']!;
const user = process.env['MONGO_USER']!;
const pass = process.env['MONGO_PASSWORD']!;
const host = process.env['MONGO_HOST']!;
const port = process.env['MONGO_PORT']!;

export interface SessionData {
	toSummon: string;
}
type BotContext = Context & SessionFlavor<SessionData>;
const bot = new BotGrammy<BotContext>(tgToken);
const mongoClient = new MongoClient(`mongodb://${user}:${pass}@${host}:${port}`);
const database = mongoClient.db('botDB');

bot.use(
	session({
		initial: () => ({toSummon: ''}),
		storage: new MongoDBAdapter({collection: database.collection<ISession>('botData')}),
	})
);

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
bot.command('write', (ctx) => {
	ctx.session.toSummon = ctx.message?.text?.split('/write')[1] || '';
	return ctx.reply('roger that', {reply_to_message_id: ctx.message?.message_id});
});
bot.on('message', (ctx) => {
	if (ctx.message.text?.includes('@all')) {
		return ctx.reply(`${ctx.session.toSummon}, you've been summoned`, {
			reply_to_message_id: ctx.message.message_id,
		});
	}
	return ctx.reply('i see');
});
bot.catch((err) => console.error(err));
bot.start({allowed_updates: ['chat_member', 'message']});
