import {bot} from '../utils/bot/bot';
import {flow} from 'fp-ts/function';

export const addSummonFunction = bot.effect(
	flow(
		bot.command('write', async (ctx) => {
			ctx.session.toSummon = ctx.message?.text?.split('/write')[1] || '';
			return ctx.reply('roger that', {reply_to_message_id: ctx.message?.message_id});
		}),
		bot.on('message', async (ctx) => {
			if (ctx.message.text?.includes('@all')) {
				return ctx.reply(`${ctx.session.toSummon}, you've been summoned`, {
					reply_to_message_id: ctx.message.message_id,
				});
			}
		})
	)
);
