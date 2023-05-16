import {bot} from '../utils/bot/bot';
import {flow} from 'fp-ts/function';

export const addSimpleRespondFunction = bot.effect(
	flow(
		bot.on('message', (ctx) => ctx.reply('i see')),
		bot.effect(() => {
			console.log('addSimpleRespondFunction');
		})
	)
);
