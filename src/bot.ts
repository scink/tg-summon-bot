import {Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';

export const getBot = (token: string) => {
	const bot = new Telegraf(token);
	bot.start((ctx) => ctx.reply('Welcome'));
	bot.help((ctx) => ctx.reply('Send me a sticker'));

	bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
	bot.hears('hi', (ctx) => {
		const info = ctx.telegram.getChatH;
		return ctx.reply('Hello !!!!!!!', {reply_to_message_id: ctx.message.message_id});
	});
	bot.launch().then();

	// Enable graceful stop
	process.once('SIGINT', () => bot.stop('SIGINT'));
	process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
