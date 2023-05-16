import {bot} from '../utils/bot/bot';
import {flow} from 'fp-ts/function';

export const addStartFunction = bot.effect(
	flow(
		bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.')),
		bot.catch((err) => console.error(err)),
		bot.start({allowed_updates: ['chat_member', 'message']}),
		bot.effect(() => {
			console.log('addStartFunction');
		})
	)
);